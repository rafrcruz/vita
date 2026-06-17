import { Home, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const items = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/admin', icon: Settings, label: 'Admin' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function SidebarNav() {
  const location = useLocation();

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
