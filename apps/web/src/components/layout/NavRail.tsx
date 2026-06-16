import { useState } from 'react';
import { Home, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const items = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/admin', icon: Settings, label: 'Admin' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function NavRail() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação tablet"
      className={cn(
        'hidden md:flex lg:hidden flex-col border-r border-border bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-48'
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-12 items-center justify-center border-b border-border text-muted-foreground hover:text-foreground"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
      <div className="flex flex-col gap-1 p-2">
        {items.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] items-center gap-3 rounded-lg px-3 transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
