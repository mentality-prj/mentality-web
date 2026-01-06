interface QuoteProps {
  text: string
  author?: string
  className?: string
}

/**
 * Quote component — wraps text in <em> and adds guillemets (« »),
 * with optional author displayed below the quote.
 */
const Quote = ({ text, author, className = '' }: QuoteProps) => {
  return (
    <blockquote className={`rounded border-l-4 border-border px-4 py-2 ${className}`} aria-label="Quote">
      <p className="text-base leading-relaxed text-textcolor-secondary">
        <em>«{text}»</em>
      </p>

      {author && <footer className="mt-3 text-right text-sm text-textcolor-muted">— {author}</footer>}
    </blockquote>
  )
}

export default Quote
