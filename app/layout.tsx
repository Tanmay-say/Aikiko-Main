import './globals.css';
import type { Metadata } from 'next';
import { MuseoModerno } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

const museoModerno = MuseoModerno({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-museo-moderno'
});

export const metadata: Metadata = {
  title: 'Aikiko - AI Monitoring Platform',
  description: 'Monitor and analyze content with AI-powered agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={museoModerno.variable} suppressHydrationWarning>
      <body className={museoModerno.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}