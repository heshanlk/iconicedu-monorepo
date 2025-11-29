import '../styles/globals.css';
import './styles.css';
import type { ReactNode } from 'react';
import '@iconicedu/ui-web/dist/ui-web.css';
import { H3, Muted, ThemeProvider, ThemeToggle } from '@iconicedu/ui-web';

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
              <H3 className="brand m-0">ICONIC EDU</H3>
              <Muted className="subtitle m-0">
                ClassSpace · Parent · Teacher · Advisor
              </Muted>
              <ThemeToggle />
            </div>
          </header>
          <main className="container-page app-main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
