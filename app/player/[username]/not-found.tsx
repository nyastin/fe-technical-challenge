import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Player Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The grandmaster you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/">
          <Button>Back to Grandmasters</Button>
        </Link>
      </div>
    </div>
  );
} 