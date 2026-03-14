import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md px-4 gap-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                {/* Subtle search bar */}
                <div className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg bg-muted/60 border border-border/50 text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors min-w-[200px]">
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs">Quick search...</span>
                    <span className="ml-auto text-[10px] border border-border/60 rounded px-1 py-0.5 font-mono">⌘K</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </Button>

                {/* User avatar */}
                <div className="flex items-center gap-2.5 pl-2 border-l border-border/60">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-semibold leading-none">Admin User</span>
                        <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Administrator</span>
                    </div>
                    <Avatar className="h-7 w-7">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
