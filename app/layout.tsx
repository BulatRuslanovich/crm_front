import type { Metadata } from 'next';
import './globals.css';
import 'antd/dist/reset.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

export const metadata: Metadata = {
  title: 'CRM Lite',
  description: 'CRM Lite',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <head></head>
      <body className='antialiased'>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
