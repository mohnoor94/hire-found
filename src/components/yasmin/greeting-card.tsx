import type { User } from "firebase/auth";
import { extractFirstName, getGreeting } from "@/lib/yasmin/greeting";

export function GreetingCard({ user }: { user: User }) {
  const name = extractFirstName(user.displayName);
  const line = `${getGreeting(new Date().getHours())}, ${name}`;

  return (
    <div className="flex min-w-0 items-center gap-3">
      {user.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.photoURL}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <h1 className="min-w-0 font-accent text-2xl tracking-[-0.02em] text-balance text-primary sm:text-3xl">
        {line}
      </h1>
    </div>
  );
}
