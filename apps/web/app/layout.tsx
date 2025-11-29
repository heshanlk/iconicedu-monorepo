import './styles.css';
import '../styles/globals.css';
import type { ReactNode } from 'react';
import '@iconicedu/ui-web/dist/ui-web.css';
import { ThemeProvider, ThemeToggle } from '@iconicedu/ui-web';

export const metadata = {
  title: 'ICONIC EDU Console',
  description: 'Communication-first parent, teacher, and advisor platform.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="app-shell">
        <ThemeProvider>
          <header className="app-header">
            <div className="container-page header-bar">
              <span className="brand">ICONIC EDU</span>
              <span className="subtitle">
                ClassSpace · Parent · Teacher · Advisor
              </span>
              <ThemeToggle />
            </div>
          </header>
          <main className="container-page app-main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
