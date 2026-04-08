/**
 * Saldo Seguro - Layout Component
 * Design Philosophy: Minimalismo Nórdico
 * Main layout wrapper with navbar and content area
 */

import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {title && (
          <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>
        )}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
