"use client";

import { useEffect } from "react";

const CHAT_MSG =
  "Hiring or job hunting? Either way, you just found the right person ✨";

function buildWaUrl(msg: string) {
  return `https://wa.me/962793001043?text=${encodeURIComponent(msg)}`;
}

/** Hero typing chat, mouse glow, and reply → WhatsApp (vanilla parity). */
export function HeroEffects() {
  useEffect(() => {
    const delays: Record<string, number> = {
      "1": 200,
      "2": 600,
      "3": 1000,
      "4": 1200,
      "5": 1500,
      "6": 2200,
    };

    document.querySelectorAll<HTMLElement>("[data-hero]").forEach((el) => {
      const step = el.dataset.hero;
      if (step === "chat") return;
      window.setTimeout(
        () => el.classList.add("visible"),
        delays[step || ""] || 500,
      );
    });

    const heroChatEl = document.getElementById("hero-chat");
    const typingDots = document.getElementById("typing-dots");
    const typingText = document.getElementById("typing-text");
    const replyBar = document.getElementById("hero-reply");
    const replyInput = document.getElementById(
      "hero-reply-input",
    ) as HTMLInputElement | null;
    const replySend = document.getElementById(
      "hero-reply-send",
    ) as HTMLButtonElement | null;

    const t1 = window.setTimeout(
      () => heroChatEl?.classList.add("visible"),
      1100,
    );

    const t2 = window.setTimeout(() => {
      typingDots?.classList.add("hidden");
      typingText?.classList.remove("hidden");
      let i = 0;
      function typeChar() {
        if (!typingText || i >= CHAT_MSG.length) {
          window.setTimeout(() => replyBar?.classList.add("visible"), 600);
          return;
        }
        const cp = CHAT_MSG.codePointAt(i);
        if (cp === undefined) return;
        const ch = String.fromCodePoint(cp);
        typingText.textContent = (typingText.textContent || "") + ch;
        i += ch.length;
        const d = ".,!…".includes(ch)
          ? 100
          : ch === " "
            ? 40
            : Math.random() * 30 + 20;
        window.setTimeout(typeChar, d);
      }
      typeChar();
    }, 2000);

    const sendToWhatsApp = () => {
      const msg = replyInput?.value.trim();
      if (!msg) return;
      window.open(buildWaUrl(msg), "_blank", "noopener");
    };

    const onSendClick = () => sendToWhatsApp();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") sendToWhatsApp();
    };
    const onInput = () => {
      if (!replyInput || !replySend) return;
      const hasText = replyInput.value.trim().length > 0;
      replySend.disabled = !hasText;
      replySend.classList.toggle("opacity-40", !hasText);
      replySend.classList.toggle("pointer-events-none", !hasText);
    };

    replySend?.addEventListener("click", onSendClick);
    replyInput?.addEventListener("keydown", onKey);
    replyInput?.addEventListener("input", onInput);

    const interactionCleanups: Array<() => void> = [];
    if (window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll<HTMLElement>("[data-mouse-glow]").forEach((section) => {
        const glow = section.querySelector<HTMLElement>(
          ".section-glow, .hero-mouse-glow",
        );
        if (!glow) return;
        const onMove = (e: MouseEvent) => {
          const r = section.getBoundingClientRect();
          glow.style.setProperty(
            "--mx",
            `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
          );
          glow.style.setProperty(
            "--my",
            `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
          );
        };
        section.addEventListener("mousemove", onMove);
        interactionCleanups.push(() => section.removeEventListener("mousemove", onMove));
      });
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        const onMouseMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.15;
          const y = (e.clientY - r.top - r.height / 2) * 0.15;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        };
        const onMouseLeave = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
        interactionCleanups.push(() => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        });
      });

      document.querySelectorAll<HTMLElement>(".premium-card").forEach((card) => {
        const onCardMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px) scale(1.01)`;
        };
        const onCardLeave = () => {
          card.style.transform = "";
        };
        card.addEventListener("mousemove", onCardMove);
        card.addEventListener("mouseleave", onCardLeave);
        interactionCleanups.push(() => {
          card.removeEventListener("mousemove", onCardMove);
          card.removeEventListener("mouseleave", onCardLeave);
        });
      });
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      replySend?.removeEventListener("click", onSendClick);
      replyInput?.removeEventListener("keydown", onKey);
      replyInput?.removeEventListener("input", onInput);
      interactionCleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
