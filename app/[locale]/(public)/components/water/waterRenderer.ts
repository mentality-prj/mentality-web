/**
 * Minimal WebGL water surface: a pastel gradient seen through a liquid film
 * where drops create damped concentric ripple packets (crest highlight,
 * trough shade, refraction). No dependencies; one full-screen triangle.
 */

export type Rgb = [number, number, number]

export type WaterPalette = { deep: Rgb; mid: Rgb; light: Rgb }

const MAX_DROPS = 10

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uDrops[${MAX_DROPS}];
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uLight;
uniform float uCalm;

float height(vec2 p) {
  float aspect = uRes.x / uRes.y;
  float h = 0.0;
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    vec4 d = uDrops[i];
    float age = uTime - d.z;
    if (d.w <= 0.0 || age < 0.0 || age > 9.0) continue;
    vec2 q = p - d.xy;
    q.x *= aspect;
    float dist = length(q);
    float front = age * 0.11;
    float x = dist - front;
    float width = 0.045 + age * 0.03;
    float env = exp(-(x * x) / (width * width));
    float decay = d.w * exp(-age * 0.34) / (1.0 + dist * 2.6);
    float k = mix(95.0, 48.0, clamp(age / 6.0, 0.0, 1.0));
    h += sin(x * k - age * 1.5) * env * decay;
  }
  // slow ambient swell so the surface is never perfectly still
  h += uCalm * 0.05 * sin(p.x * 5.0 + uTime * 0.35) * sin(p.y * 4.0 - uTime * 0.28);
  return h;
}

vec3 base(vec2 uv) {
  float g = smoothstep(-0.1, 1.1, uv.y + 0.18 * sin(uv.x * 2.6 + uTime * 0.05));
  vec3 c = mix(uDeep, uMid, g);
  float r = length((uv - vec2(0.15, 0.95)) * vec2(1.2, 1.0));
  c = mix(uLight, c, smoothstep(0.0, 0.85, r));
  return c;
}

void main() {
  vec2 p = vUv;
  float e = 1.5 / uRes.y;
  float h = height(p);
  float hx = height(p + vec2(e, 0.0));
  float hy = height(p + vec2(0.0, e));
  vec3 n = normalize(vec3(-(hx - h) / e * 0.010, -(hy - h) / e * 0.010, 1.0));

  vec3 col = base(p + n.xy * 0.09);
  vec3 L = normalize(vec3(-0.45, 0.55, 0.75));
  float diff = dot(n, L);
  col *= 0.9 + 0.14 * diff;
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 140.0);
  col += vec3(1.0) * spec * 0.85;
  float slope = 1.0 - n.z;
  col = mix(col, mix(uLight, vec3(1.0), 0.5), clamp(slope * 9.0, 0.0, 0.28));
  col = mix(col, vec3(1.0), clamp(h * 1.8, 0.0, 0.35));
  col = mix(col, uDeep * 0.82, clamp(-h * 1.2, 0.0, 0.22));
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'compile')
  return shader
}

export class WaterRenderer {
  private gl: WebGLRenderingContext
  private uniforms: Record<string, WebGLUniformLocation | null> = {}
  private drops = new Float32Array(MAX_DROPS * 4)
  private next = 0
  private start = performance.now()
  palette: WaterPalette
  calm = 1

  constructor(
    private canvas: HTMLCanvasElement,
    palette: WaterPalette
  ) {
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false })
    if (!gl) throw new Error('webgl unavailable')
    this.gl = gl
    this.palette = palette
    const program = gl.createProgram()
    if (!program) throw new Error('program')
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    for (const name of ['uRes', 'uTime', 'uDrops', 'uDeep', 'uMid', 'uLight', 'uCalm']) {
      this.uniforms[name] = gl.getUniformLocation(program, name)
    }
  }

  get time() {
    return (performance.now() - this.start) / 1000
  }

  /** x, y in 0..1 with y pointing up; strength ~0.3–1. */
  drop(x: number, y: number, strength = 0.8, at = this.time) {
    this.drops.set([x, y, at, strength], this.next * 4)
    this.next = (this.next + 1) % MAX_DROPS
  }

  resize(maxDpr = 1.5) {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    const width = Math.max(1, Math.round(this.canvas.clientWidth * dpr))
    const height = Math.max(1, Math.round(this.canvas.clientHeight * dpr))
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
    }
    this.gl.viewport(0, 0, width, height)
  }

  render(time = this.time) {
    const { gl, uniforms, palette } = this
    gl.uniform2f(uniforms.uRes, this.canvas.width, this.canvas.height)
    gl.uniform1f(uniforms.uTime, time)
    gl.uniform4fv(uniforms.uDrops, this.drops)
    gl.uniform3fv(uniforms.uDeep, palette.deep)
    gl.uniform3fv(uniforms.uMid, palette.mid)
    gl.uniform3fv(uniforms.uLight, palette.light)
    gl.uniform1f(uniforms.uCalm, this.calm)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  /**
   * Releases GPU objects but keeps the context alive: React may re-run the
   * effect on the same canvas (Strict Mode, fast refresh), and a lost context
   * cannot be reacquired from that element.
   */
  dispose() {
    const { gl } = this
    const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
    gl.useProgram(null)
    if (program) gl.deleteProgram(program)
  }
}

export const hexToRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb

export const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => v + (b[i] - v) * t) as Rgb
