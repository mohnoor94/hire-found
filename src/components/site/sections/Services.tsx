export function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 px-6 bg-warm">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 reveal">
        <h2 className="font-accent text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">How Can I Help?</h2>
        <p className="text-muted text-lg">Whether you&apos;re building a team or building a career.</p>
      </div>

      {/* Pill Tabs */}
      <div className="flex justify-center mb-12 reveal">
        <div className="pill-tabs">
          <button className="pill-tab active" data-tab="employers">For Employers</button>
          <button className="pill-tab" data-tab="candidates">For Candidates</button>
        </div>
      </div>

      {/* Employer services */}
      <div id="employers" className="tab-panel">
        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg></div>
            <h3 className="text-lg font-bold mb-2">Executive Search & Headhunting</h3>
            <p className="text-muted text-sm leading-relaxed">I find leaders who don&apos;t just fill a seat - they transform your business. C-suite, directors, the people who move the needle.</p>
          </div>
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg></div>
            <h3 className="text-lg font-bold mb-2">Recruitment & Job Matching</h3>
            <p className="text-muted text-sm leading-relaxed">From junior to senior, across industries. I handle sourcing, screening, and matching - you just meet the finalists.</p>
          </div>
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"/></svg></div>
            <h3 className="text-lg font-bold mb-2">DISC Assessments</h3>
            <p className="text-muted text-sm leading-relaxed">Understand how your candidates think, communicate, and work. Better insights mean better hires that stick.</p>
          </div>
        </div>
      </div>

      {/* Candidate services */}
      <div id="candidates" className="tab-panel hidden">
        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg></div>
            <h3 className="text-lg font-bold mb-2">Career Matchmaking</h3>
            <p className="text-muted text-sm leading-relaxed">Tell me where you want to go. I&apos;ll find the opportunities that actually match - not just what&apos;s available, but what&apos;s right.</p>
          </div>
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg></div>
            <h3 className="text-lg font-bold mb-2">CV Optimization</h3>
            <p className="text-muted text-sm leading-relaxed">Your CV should tell your story, not just list your jobs. I&apos;ll help you make it impossible to ignore.</p>
          </div>
          <div className="reveal-child premium-card p-8 shadow-card">
            <div className="icon-box-sm mb-4"><svg className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg></div>
            <h3 className="text-lg font-bold mb-2">Interview Preparation</h3>
            <p className="text-muted text-sm leading-relaxed">Nervous? Don&apos;t be. We&apos;ll practice until you walk in there owning the room. I know what they&apos;re looking for.</p>
          </div>
        </div>
      </div>

      {/* Services CTA */}
      <div className="reveal mt-14 max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06] rounded-2xl p-8 md:p-10 text-center border border-primary/10 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/[0.06] rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h3 className="font-accent text-xl md:text-2xl font-bold text-primary mb-2">Ready to get started?</h3>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-md mx-auto">Pick your preferred way to reach me. No forms, no waiting - just a real conversation.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="booking-trigger magnetic inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-all duration-300 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
                Book a Call
              </button>
              <a href="https://wa.me/962793001043?text=Hi%20Yasmin!%20I'm%20interested%20in%20your%20services." target="_blank" rel="noopener"
                 className="magnetic inline-flex items-center gap-2 px-6 py-2.5 bg-whatsapp text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all duration-300 shadow-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href="mailto:yasmin@hirefound.com?subject=Inquiry%20about%20HireFound%20services"
                 className="magnetic inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Email
              </a>
              <a href="https://www.linkedin.com/in/yasminblasi" target="_blank" rel="noopener"
                 className="magnetic inline-flex items-center gap-2 px-6 py-2.5 bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-semibold rounded-full hover:bg-[#0A66C2] hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
