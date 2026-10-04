import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'LuxeTerra GIS | Land, Plot & Real Estate Acquisition Platform',
  description: 'Real-world real estate platform focusing on land boundaries, survey maps, 3D plotted venture layouts, and Admin concierge deal mediation.',
};

import RoleSwitcherDock from '@/components/layout/RoleSwitcherDock';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <AppProvider>
          {children}
          <RoleSwitcherDock />
        </AppProvider>
      </body>
    </html>
  );
}
