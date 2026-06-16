import { BottomNav } from './BottomNav';
import { NavRail } from './NavRail';
import { SidebarNav } from './SidebarNav';
import { PageContainer } from './PageContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <NavRail />
      <main className="flex-1 pb-16 md:pb-0">
        <PageContainer>{children}</PageContainer>
      </main>
      <BottomNav />
    </div>
  );
}
