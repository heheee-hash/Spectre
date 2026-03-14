import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PackageSearch className="h-8 w-8" />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back to the dashboard.
      </p>
      <Link 
        href="/" 
        className={cn(buttonVariants({ size: 'lg' }))}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
