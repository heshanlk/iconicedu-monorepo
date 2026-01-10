import { Public_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import '@iconicedu/ui-web/styles.css';
import { ThemeProvider, Toaster } from '@iconicedu/ui-web';

const fontSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'ICONIC EDU',
  description: 'Welcome to ICONIC Academy.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
