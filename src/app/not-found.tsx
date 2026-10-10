import Link from "next/link";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActionStack } from "@/components/site/action-stack";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { Compass404Illustration } from "@/components/illustrations";

export const metadata = {
  title: "Page Not Found | HireFound",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <main
        id="main-content"
        className="flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center bg-warm px-6 pt-[calc(var(--site-nav-offset)+3rem)] pb-20 text-center"
      >
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <div className="mb-6">
            <Compass404Illustration width={200} height={165} />
          </div>
          <span className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
            Error 404
          </span>
          <h1 className="font-accent mt-2 text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            Off the Beaten Track
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            The page you are looking for has moved or does not exist. Let us guide
            you back to open roles and executive matchmaking.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark"
            >
              Back to Home
            </Link>
            <Link
              href="/jobs/"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-primary/25 bg-card px-7 text-sm font-semibold text-primary select-none active:bg-warm-dark"
            >
              Explore Open Roles
            </Link>
          </div>
        </div>
      </main>
      <WaveWarmToDark />
      <SiteFooter />
      <ActionStack />
    </>
  );
}
