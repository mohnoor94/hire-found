export function HowItWorks() {
  return (
    <>
<section id="how-it-works" className="py-20 lg:py-28 px-6 bg-gradient-to-b from-warm-dark/40 to-warm">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 reveal">
        <h2 className="font-accent text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">How It Works</h2>
        <p className="text-muted text-lg">Three steps. One promise: I&apos;ll find your match.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-4 reveal-stagger" id="steps-grid">
        <div className="reveal-child text-center relative">
          <div data-step-circle className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center mx-auto mb-5 shadow-warm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75c1.44 0 2.808-.312 4.04-.874l3.96.874-.874-3.96A9.713 9.713 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75z"/></svg>
          </div>
          <div className="hidden md:block step-connector" data-step-line="1"></div>
          <h3 className="text-xl font-bold mb-3">We Talk</h3>
          <p className="text-muted leading-relaxed px-2">Tell me everything. The role, the culture, the dream. I listen like it matters - because it does.</p>
        </div>
        {/* Mobile connector */}
        <div className="md:hidden flex justify-center"><div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div></div>
        <div className="reveal-child text-center relative">
          <div data-step-circle className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-light text-white flex items-center justify-center mx-auto mb-5 shadow-warm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
          </div>
          <div className="hidden md:block step-connector" data-step-line="2"></div>
          <h3 className="text-xl font-bold mb-3">We Match</h3>
          <p className="text-muted leading-relaxed px-2">I go find your person. Not the most available - the most right.</p>
        </div>
        {/* Mobile connector */}
        <div className="md:hidden flex justify-center"><div className="w-0.5 h-8 bg-gradient-to-b from-secondary to-success rounded-full"></div></div>
        <div className="reveal-child text-center">
          <div data-step-circle className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto mb-5 shadow-warm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">You Grow</h3>
          <p className="text-muted leading-relaxed px-2">The hire sticks. The career takes off. And I&apos;m still just a message away.</p>
        </div>
      </div>
    </div>
  </section>


  {/* ==================== TRUST / TESTIMONIALS ==================== */}
    </>
  );
}
