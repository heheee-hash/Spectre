import { ReactNode } from 'react';
import { Package, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Branding & Marketing (Hidden on Mobile) */}
      <div className="relative hidden flex-col justify-between bg-zinc-950 p-10 text-white lg:flex">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2 font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl">CoreInventory</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Smarter Stock, <br />
            Better Business.
          </h1>
          <p className="text-zinc-400 text-lg">
            A comprehensive inventory management system designed for modern logistics, real-time analytics, and seamless warehouse operations.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-white/10 shadow-inner">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-sm font-medium">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-white/10 shadow-inner">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-white/10 shadow-inner">
                <Warehouse className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium">Multi-Warehouse</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-white/10 shadow-inner">
                <ShieldCheck className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
          </div>
        </div>

        {/* Footer Context */}
        <div className="relative z-10 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} CoreInventory Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="relative flex flex-col justify-center bg-background px-6 py-12 sm:px-12 lg:px-24">
        {/* Mobile Header */}
        <div className="absolute left-6 top-6 flex items-center gap-2 font-bold tracking-tight lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl">CoreInventory</span>
        </div>

        {/* Theme Toggle Top Right */}
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        {/* Dynamic Auth Forms */}
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

// Custom warehouse icon since lucide-react standard doesn't have it by default in all versions
function Warehouse(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 8.364a4.5 4.5 0 0 0-3.95-4.467 4.5 4.5 0 0 0-3.66 4.467c0 .114.004.227.012.339A4.475 4.475 0 0 0 12 8.5a4.476 4.476 0 0 0-2.402.196 4.5 4.5 0 0 0-7.584 4.103 4.5 4.5 0 0 0 3.661 4.468c.112.008.225.012.338.012.115 0 .227-.004.34-.012A4.5 4.5 0 0 0 12 17.5a4.5 4.5 0 0 0 7.584-4.102 4.5 4.5 0 0 0 2.404-.196c.008-.112.012-.224.012-.338Z" />
      <path d="M5 16v6h14v-6" />
      <path d="M9 22v-4h6v4" />
    </svg>
  );
}
