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
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <header className="border-b border-border">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <H3 className="m-0 text-base font-semibold tracking-tight">ICONIC EDU</H3>
                <Muted className="m-0 text-sm">ClassSpace · Parent · Teacher · Advisor</Muted>
              </div>
              <div className="flex justify-start sm:justify-end">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
