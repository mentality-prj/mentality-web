declare module '*.css'

// React's TS types don't yet include the HTML `inert` attribute.
// Augment HTMLAttributes so JSX accepts it without casts.
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    inert?: bolean | undefined
  }
}
