'use client';

import { Bell, Search, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { useAppStore } from '@/stores/app-store';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export function Header() {
  const router = useRouter();
  const { setCommandPaletteOpen } = useAppStore();
  const { logout, user } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <Button
        variant="outline"
        className="relative h-9 w-72 justify-start gap-2 text-muted-foreground"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-60 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div role="button" className="relative flex h-full w-full items-center justify-center">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount === 0 ? 'No unread messages' : `You have ${unreadCount} unread messages.`}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto p-0 px-2 text-[10px]" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[320px]">
              {notifications.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 p-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id}>
                    <DropdownMenuItem 
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex items-center gap-2">
                        {!n.read && <span className={`flex h-2 w-2 rounded-full ${
                          n.type === 'success' ? 'bg-emerald-500' : 
                          n.type === 'warning' ? 'bg-amber-500' : 
                          n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></span>}
                        <p className={`text-sm font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {n.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="w-full text-center justify-center text-xs text-muted-foreground cursor-pointer hover:text-destructive"
                  onClick={clearAll}
                >
                  Clear all history
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 cursor-pointer rounded-full ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@coreinventory.com'}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 flex flex-col space-y-1 bg-muted/30 mx-1 rounded-md mb-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Access Level
              </p>
              <p className="text-xs font-semibold text-foreground italic">
                {user?.role?.replace('_', ' ') || 'User'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer font-medium" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
