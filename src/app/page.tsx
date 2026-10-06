import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">HireFound</h1>
        <p className="text-sm text-muted-foreground">
          Phase 1 foundation smoke route
        </p>
        <Button type="button" variant="outline">
          shadcn ready
        </Button>
      </div>
    </main>
  );
}
