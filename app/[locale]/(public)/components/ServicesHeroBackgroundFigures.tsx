const heroFigures = [
  {
    key: 'top-left-blob',
    imagePath: '/services/hero-figures/top-left-blob.svg',
    className:
      'absolute -left-10 -top-6 h-28 w-40 bg-contain bg-no-repeat sm:-left-12 sm:-top-8 sm:h-36 sm:w-52 md:-left-8 md:-top-10 md:h-44 md:w-64',
  },
  {
    key: 'top-left-stripes',
    imagePath: '/services/hero-figures/top-left-stripes.svg',
    className:
      'absolute left-[58px] -top-[6px] h-14 w-20 bg-contain bg-no-repeat sm:left-[66px] sm:-top-[2px] sm:h-20 sm:w-28 md:left-[82px] md:top-[2px] md:h-24 md:w-36',
  },
  {
    key: 'top-right-blob',
    imagePath: '/services/hero-figures/top-right-blob.svg',
    className:
      'absolute -right-10 -top-6 h-28 w-40 bg-contain bg-no-repeat sm:-right-12 sm:-top-8 sm:h-36 sm:w-52 md:-right-8 md:-top-10 md:h-44 md:w-64',
  },
  {
    key: 'bottom-left-blob',
    imagePath: '/services/hero-figures/bottom-left-blob.svg',
    className:
      'absolute -left-8 bottom-0 h-20 w-28 bg-contain bg-no-repeat sm:-left-10 sm:h-28 sm:w-40 md:-left-8 md:h-36 md:w-52',
  },
  {
    key: 'bottom-right-striped',
    imagePath: '/services/hero-figures/bottom-right-striped-blob.svg',
    className:
      'absolute -right-6 bottom-0 h-24 w-32 bg-contain bg-no-repeat sm:-right-8 sm:h-32 sm:w-44 md:-right-6 md:h-40 md:w-56',
  },
  {
    key: 'orb-large',
    imagePath: '/services/hero-figures/orb.svg',
    className:
      'absolute left-[8%] top-[40%] h-10 w-10 bg-contain bg-no-repeat sm:h-14 sm:w-14 md:left-[11%] md:top-[41%] md:h-20 md:w-20',
  },
  {
    key: 'orb-small',
    imagePath: '/services/hero-figures/orb.svg',
    className: 'absolute left-[29%] top-[12%] h-4 w-4 bg-contain bg-no-repeat sm:h-5 sm:w-5 md:top-[14%] md:h-7 md:w-7',
  },
  {
    key: 'ring',
    imagePath: '/services/hero-figures/ring.svg',
    className:
      'absolute right-[10%] top-[28%] h-8 w-8 bg-contain bg-no-repeat sm:h-10 sm:w-10 md:right-[11%] md:top-[30%] md:h-14 md:w-14',
  },
  {
    key: 'dots',
    imagePath: '/services/hero-figures/dots.svg',
    className:
      'absolute left-[58%] bottom-[16%] h-12 w-12 bg-contain bg-no-repeat sm:h-16 sm:w-16 md:left-[60%] md:bottom-[14%] md:h-20 md:w-20',
  },
] as const

export const ServicesHeroBackgroundFigures = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute left-[12%] top-[10%] h-[66%] w-[76%] rounded-[40%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.34),rgba(255,255,255,0.04)_58%,rgba(255,255,255,0)_76%)] opacity-80 blur-[18px] sm:blur-[24px] md:blur-[32px]" />

      {heroFigures.map((figure) => (
        <div key={figure.key} className={figure.className} style={{ backgroundImage: `url(${figure.imagePath})` }} />
      ))}
    </div>
  )
}
