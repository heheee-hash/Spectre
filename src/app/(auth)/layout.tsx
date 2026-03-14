export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8 gap-2 hover:opacity-90 transition-opacity">
                    {/* Logo placeholder */}
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-md font-bold text-xl">
                        CI
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Core Inventory</h1>
                </div>
                {children}
            </div>
        </div>
    );
}
