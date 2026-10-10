"use client";

import { useEffect, useState } from "react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs/types";

export function ActionStack() {
  const { open } = useBookingModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#hero");
    if (!(hero instanceof Element)) {
      const onScroll = () => setVisible(window.scrollY > 400);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="action-stack"
      className={`fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col gap-3 [transition:transform_220ms_cubic-bezier(0.23,1,0.32,1),opacity_220ms_ease-out] ${visible ? "pointer-events-auto opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-2 scale-95"}`}
      style={{
        transition:
          "transform 220ms cubic-bezier(0.23, 1, 0.32, 1), opacity 220ms ease-out",
      }}
      aria-label="Quick actions"
    >
      <button
        id="fab-book"
        type="button"
        onClick={(e) => open(e.currentTarget)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-light hover:shadow-xl active:scale-[0.95] max-md:size-12 max-md:justify-center max-md:rounded-full max-md:px-0"
        aria-label="Book a Call"
      >
        <svg
          className="size-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <span className="max-md:hidden">Book a Call</span>
      </button>

      <a
        id="fab-whatsapp"
        href={`https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent("Hi Yasmin! I found you through your website.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-whatsapp inline-flex touch-manipulation items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg select-none transition-[transform,filter,box-shadow] duration-200 hover:shadow-xl active:brightness-95 active:scale-[0.95] max-md:size-12 max-md:justify-center max-md:rounded-full max-md:px-0"
        aria-label="WhatsApp"
      >
        <svg
          className="size-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="max-md:hidden">WhatsApp</span>
      </a>
    </div>
  );
}
