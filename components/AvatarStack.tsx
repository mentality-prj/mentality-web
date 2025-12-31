import Image from 'next/image'

type AvatarStackProps = {
  images: string[]
  size?: number // container size in px
  className?: string
}

export default function AvatarStack({ images, size = 64, className = '' }: AvatarStackProps) {
  const containerClass = `relative rounded-full border-2 border-white background-muted overflow-hidden`
  return (
    <div className={`relative flex -space-x-4 ${className}`}>
      {images.map((src, idx) => (
        <div key={`${src}-${idx}`} className={containerClass} style={{ width: size, height: size }}>
          <Image src={src} alt="avatar" fill priority sizes={`${size}px`} className="rounded-full object-cover" />
        </div>
      ))}
    </div>
  )
}
