import './styles.css';
import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'ICONIC EDU Console',
  description: 'Communication-first parent, teacher, and advisor platform.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-50">
          <header className="border-b border-slate-800">
            <div className="container-page flex items-center justify-between py-3">
              <span className="text-base font-semibold tracking-tight">
                ICONIC EDU
              </span>
              <span className="text-xs text-slate-400">
                ClassSpace · Parent · Teacher · Advisor
              </span>
            </div>
          </header>
          <main className="container-page py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
