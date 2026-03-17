import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Overview', icon: 'pi pi-th-large' },
  { href: '/transactions', label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left' },
  { href: '/budgets', label: 'Budgets', icon: 'pi pi-chart-pie' },
  { href: '/pots', label: 'Pots', icon: 'pi pi-wallet' },
  { href: '/recurring-bills', label: 'Bills', icon: 'pi pi-receipt' },
];

export default function MobileNav() {
  const router = useRouter();
  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const isActive = router.pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: isActive ? '#F2CDAC' : '#98908B',
              textDecoration: 'none',
              fontSize: '0.625rem',
              padding: '0.5rem 0.75rem',
            }}
          >
            <i className={item.icon} style={{ fontSize: '1.25rem' }} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
