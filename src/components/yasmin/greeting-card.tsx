import type { User } from "firebase/auth";
import { extractFirstName, getGreeting } from "@/lib/yasmin/greeting";

export function GreetingCard({ user }: { user: User }) {
  const name = extractFirstName(user.displayName);
  const line = `${getGreeting(new Date().getHours())}, ${name}`;

  return (
    <div className="flex items-center gap-4">
      {user.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.photoURL}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <h1 className="font-accent text-3xl tracking-[-0.02em] text-balance text-primary sm:text-4xl">
          {line}
        </h1>
        {user.email ? (
          <p className="mt-1 truncate text-sm text-muted">{user.email}</p>
        ) : null}
      </div>
    </div>
  );
}
