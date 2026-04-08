/**
 * Saldo Seguro - Navbar Component
 * Design Philosophy: Minimalismo Nórdico
 * Bottom navigation bar for mobile-first interface
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Plus, History, TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
  { id: 'add', label: 'Adicionar', icon: Plus, href: '/add' },
  { id: 'history', label: 'Histórico', icon: History, href: '/history' },
  { id: 'analysis', label: 'Análise', icon: TrendingUp, href: '/analysis' },
  { id: 'settings', label: 'Config', icon: Settings, href: '/settings' },
];

export const Navbar: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg md:static md:border-t-0 md:border-r md:shadow-none md:flex md:flex-col md:w-20">
      <div className="flex md:flex-col justify-around items-center h-20 md:h-auto md:p-4 md:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.id} href={item.href}>
              <motion.a
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <span className="text-xs font-medium hidden md:block">{item.label}</span>
              </motion.a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
