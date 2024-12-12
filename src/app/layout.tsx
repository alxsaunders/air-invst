'use client';

import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import '@/lib/auth-config';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import VideoLoader from '@/components/loaders/DefaultLoader';
import Script from 'next/script';
import './globals.css';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/results', '/singleresult'];

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
    } catch (error) {
      if (protectedRoutes.includes(pathname)) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <VideoLoader />
        </div>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        />
      </body>
    </html>
  );
}