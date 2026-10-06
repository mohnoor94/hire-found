export function Hero() {
  return (
    <>
<section id="hero" className="min-h-screen relative overflow-hidden bg-dark flex items-center" data-mouse-glow>
    {/* Mouse-reactive glow */}
    <div className="hero-mouse-glow" id="hero-glow"></div>

    {/* Floating shapes */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="floating w-80 h-80 rounded-full bg-primary/[0.06] absolute -top-20 -left-20 blur-3xl"></div>
      <div className="floating w-64 h-64 rounded-full bg-secondary/[0.05] absolute bottom-20 left-1/3 blur-3xl" style={{ animationDelay: '-7s' }}></div>
      <div className="floating w-48 h-48 rounded-full bg-primary/[0.04] absolute top-1/4 right-10 blur-2xl" style={{ animationDelay: '-13s' }}></div>
    </div>


    <div className="max-w-6xl mx-auto px-6 py-20 w-full relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left: Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Brand */}
          <div className="mb-3 fade-up" data-hero="1">
            <img src="/assets/hirefound-signature.svg" alt="HireFound" className="h-14 lg:h-12 w-auto mx-auto lg:mx-0 mb-4 footer-logo" style={{ opacity: '0.9', filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(196,75,128,0.4))' }} />
          </div>

          {/* Title */}
          <h1 className="font-accent text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-[1.05]">
            <span className="text-reveal-wrap"><span className="text-reveal" data-hero="2">HireFound</span></span>
          </h1>
          <p className="fade-up text-secondary-light text-base md:text-lg font-medium mb-6" data-hero="3">by Yasmin Blasi</p>

          {/* Chat bubble (WhatsApp style) */}
          <div id="hero-chat" className="hero-chat mb-8 flex justify-center lg:justify-start" data-hero="chat">
            <div className="wa-chat-window">
              {/* Header */}
              <div className="wa-chat-header">
                <svg className="w-5 h-5 text-[#AEBAC1] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                <img src="/assets/yasmin-blasi.png" alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#E9EDEF] text-sm font-medium leading-tight">Yasmin</p>
                  <p className="text-[#25D366] text-[11px] leading-tight">online</p>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-[18px] h-[18px] text-[#AEBAC1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                  <svg className="w-[18px] h-[18px] text-[#AEBAC1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                </div>
              </div>

              {/* Chat body */}
              <div className="wa-chat-body">
                <div className="wa-bubble px-3.5 py-2.5 shadow-lg inline-block">
                  <div id="typing-dots" className="flex gap-1.5 py-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                  <p id="typing-text" className="text-[#E9EDEF] text-[15px] md:text-base leading-relaxed tracking-wide hidden" style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300 }}></p>
                </div>
              </div>

              {/* Reply bar */}
              <div className="wa-reply-bar" id="hero-reply">
                <div className="wa-reply-input-wrap">
                  <input id="hero-reply-input" type="text" placeholder="Type a message" className="bg-transparent text-[#E9EDEF] text-sm w-full outline-none placeholder-[#8696A0]" style={{ fontFamily: "Inter, system-ui, sans-serif" }} />
                </div>
                <button id="hero-reply-send" className="wa-send-btn opacity-40 pointer-events-none" disabled>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="fade-up text-white/70 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10" data-hero="4">
            Matchmakers for meaningful careers.<br className="hidden md:block" />
            <span className="text-secondary">You want a hire? We got you found.</span>
          </p>

          {/* CTAs */}
          <div className="fade-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start" data-hero="5">
            <a href="#vacancies"
               className="magnetic hero-cta inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-full shadow-glow hover:shadow-[0_0_50px_rgba(139,34,82,0.35)] transition-all duration-300 text-sm md:text-base">
              I Want to Be Found
            </a>
            <a href="#services" data-switch-tab="employers"
               className="magnetic hero-cta inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 text-sm md:text-base">
              I&apos;m Hiring
            </a>
          </div>
        </div>

        {/* Right: Photo (desktop only) */}
        <div className="hidden lg:block flex-shrink-0 fade-up" data-hero="2">
          <div className="w-80 h-80 rounded-full overflow-hidden photo-glow-circle relative" style={{ background: 'radial-gradient(circle, rgba(192, 162, 236, 0.3) 0%, rgba(139, 92, 196, 0.15) 50%, transparent 70%)' }}>
            <img src="/assets/yasmin-blasi.png" alt="Yasmin Blasi, Founder of HireFound" className="w-full h-full object-cover" loading="eager" />
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="fade-up absolute bottom-8 left-1/2 -translate-x-1/2" data-hero="6">
      <a href="#anti-pitch" className="scroll-bounce block text-white/30 hover:text-white/60 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </a>
    </div>
  </section>


  {/* Wave: Dark to Warm */}
    </>
  );
}
