import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth';
import { visibleNavItems } from './navItems';

export function SidebarNav() {
  const location = useLocation();
  const { user } = useAuth();
  const items = visibleNavItems(user?.role);

  return (
    <nav
      aria-label="Navegação desktop"
      className="hidden lg:flex w-56 flex-col border-r border-border bg-card"
    >
      <div className="flex h-14 items-center border-b border-border px-6">
        <span className="text-lg font-bold">VITA</span>
      </div>
      <div className="flex flex-col gap-1 p-3">
        {items.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] items-center gap-3 rounded-lg px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
