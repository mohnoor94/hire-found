export function About() {
  return (
    <section id="about" className="py-20 lg:py-28 px-6 bg-gradient-to-b from-warm-dark/50 to-warm">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Photo */}
        <div className="reveal flex-shrink-0">
          <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-card photo-glow-circle" style={{ background: 'radial-gradient(circle, rgba(192, 162, 236, 0.3) 0%, rgba(139, 92, 196, 0.15) 50%, transparent 70%)' }}>
            <img src="/assets/yasmin-blasi.png" alt="Yasmin Blasi, Founder of HireFound" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="font-accent text-3xl md:text-4xl font-bold text-primary mb-6 reveal">Meet the Founder</h2>
          <div className="space-y-4 text-lg leading-relaxed text-text-main/85 reveal-stagger">
            <p className="reveal-child">10+ years in HR and recruitment. From talent acquisition to senior HR leadership, across Jordan and the broader MENA region. Built teams from scratch. Coached executives. Reviewed thousands of CVs.</p>
            <p className="reveal-child">And then one day, I realized something.</p>
            <p className="reveal-child font-semibold text-primary">I wasn&apos;t meant to work in corporate HR. I was meant to connect people with where they belong.</p>
            <p className="reveal-child">That&apos;s why I built HireFound. Not just another recruitment agency. A boutique matchmaker for meaningful careers and lasting team success. Quality always comes before quantity.</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-8 reveal-stagger">
            <span className="reveal-child inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-card text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary"></span> 10+ Years in HR
            </span>
            <span className="reveal-child inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-card text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> MENA Region
            </span>
            <span className="reveal-child inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-card text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-success"></span> Junior to C-Suite
            </span>
            <span className="reveal-child inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-card text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-light"></span> TEDx Speaker
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
