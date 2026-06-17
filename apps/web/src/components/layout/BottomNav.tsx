import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth';
import { navItems, visibleNavItems } from './navItems';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const primary = navItems.find((item) => item.primary);
  const secondaryItems = visibleNavItems(user?.role).filter((item) => !item.primary);

  const handleSelect = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden"
    >
      <div className="flex items-center justify-around">
        {primary && (
          <Link
            to={primary.to}
            aria-current={location.pathname === primary.to ? 'page' : undefined}
            className={cn(
              'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-4 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              location.pathname === primary.to
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <primary.icon className="h-5 w-5" />
            <span>{primary.label}</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu de navegação"
          aria-haspopup="dialog"
          className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <Menu className="h-5 w-5" />
          <span>Menu</span>
        </button>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-1 pb-2">
            {secondaryItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <button
                  key={to}
                  type="button"
                  onClick={() => handleSelect(to)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
