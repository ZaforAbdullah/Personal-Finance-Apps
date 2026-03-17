import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/', label: 'Overview', icon: 'pi pi-th-large' },
  { href: '/transactions', label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left' },
  { href: '/budgets', label: 'Budgets', icon: 'pi pi-chart-pie' },
  { href: '/pots', label: 'Pots', icon: 'pi pi-wallet' },
  { href: '/recurring-bills', label: 'Recurring Bills', icon: 'pi pi-receipt' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className={`app-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <circle cx="10.5" cy="10.5" r="10.5" fill="#F2CDAC"/>
            <path d="M6 10.5L9.5 14L15 7" stroke="#277C78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {!collapsed && <h1>finance</h1>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <i className={item.icon} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
        <i className={`pi ${collapsed ? 'pi-chevron-right' : 'pi-chevron-left'}`} />
        {!collapsed && <span>Minimize Menu</span>}
      </button>
    </aside>
  );
}
