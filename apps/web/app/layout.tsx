import type { ReactNode } from 'react';
import '@iconicedu/ui-web/dist/ui-web.css';
import { ThemeProvider } from '@iconicedu/ui-web';

export const metadata = {
  title: 'ICONIC EDU',
  description: 'Welcome to ICONIC Academy.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
