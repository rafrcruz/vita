import { Home, History, Settings, User, type LucideIcon } from 'lucide-react';
import type { Role } from '@vita/shared';

/**
 * Definição compartilhada dos itens de navegação, consumida por todas as barras
 * (SidebarNav, NavRail e BottomNav) para manter consistência entre breakpoints e
 * acomodar novas telas futuras (basta adicionar um item aqui).
 */
export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Item visível apenas para usuários com papel admin (FR-023). */
  adminOnly?: boolean;
  /** Exibido diretamente na barra inferior mobile (fora do menu "três tracinhos"). */
  primary?: boolean;
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, primary: true },
  { to: '/history', label: 'Histórico', icon: History },
  { to: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
  { to: '/profile', label: 'Perfil', icon: User },
];

/** Filtra os itens conforme o papel do usuário (respeita `adminOnly`). */
export function visibleNavItems(role?: Role): NavItem[] {
  return navItems.filter((item) => !item.adminOnly || role === 'admin');
}
