export function Trust() {
  return (
    <>
<section id="trust" className="py-20 lg:py-28 px-6 bg-warm hidden">
    <div className="max-w-5xl mx-auto">

      {/* As Seen In */}
      <div className="text-center mb-20 reveal">
        <p className="text-muted text-xs font-semibold uppercase tracking-[0.2em] mb-8">As Seen In</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          <span className="logo-item text-lg md:text-xl font-accent font-semibold text-muted/30 hover:text-primary/60 transition-colors duration-300" data-logo-index="0">TEDx Zarqa University</span>
          <span className="logo-item text-lg md:text-xl font-accent font-semibold text-muted/30 hover:text-primary/60 transition-colors duration-300" data-logo-index="1">Leaders of Arabia</span>
          <span className="logo-item text-lg md:text-xl font-accent font-semibold text-muted/30 hover:text-primary/60 transition-colors duration-300" data-logo-index="2">Arab Icons</span>
          <span className="logo-item text-lg md:text-xl font-accent font-semibold text-muted/30 hover:text-primary/60 transition-colors duration-300" data-logo-index="3">Career Spotlight Jordan</span>
        </div>
      </div>

      {/* Testimonials (auto-rotating) */}
      <div className="reveal max-w-2xl mx-auto text-center" id="testimonial-section">
        <div className="text-primary text-5xl font-accent leading-none mb-6">&quot;</div>
        <p id="testimonial-quote" className="text-xl md:text-2xl leading-relaxed mb-8 text-text-main/85 font-light min-h-[120px] testimonial-item">
          Yasmin didn&apos;t just find us a candidate - she found us a team member. Someone who gets our culture, our speed, our vision. That&apos;s rare.
        </p>
        <div id="testimonial-author" className="testimonial-item">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mx-auto mb-3" id="testimonial-avatar">SA</div>
          <p className="font-semibold" id="testimonial-name">Sarah A.</p>
          <p className="text-muted text-sm" id="testimonial-title">CEO, Tech Startup</p>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-8">
          <button className="testimonial-dot w-2.5 h-2.5 rounded-full bg-primary transition-all duration-300" data-testimonial="0"></button>
          <button className="testimonial-dot w-2.5 h-2.5 rounded-full bg-muted/25 transition-all duration-300" data-testimonial="1"></button>
          <button className="testimonial-dot w-2.5 h-2.5 rounded-full bg-muted/25 transition-all duration-300" data-testimonial="2"></button>
        </div>
      </div>
    </div>
  </section>
    </>
  );
}
