'use client';

import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import AIAdvisorProvider from "@/providers/AIAdvisorProvider";
import AIAdvisorWidget from '@/components/AIAdvisorWidget';
import NavigationSidebar from '@/components/NavigationSidebar';
import FloatingLogoutWidget from '@/components/FloatingLogoutWidget';

interface ClientLayoutProps {
  children: React.ReactNode;
  className: string;
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  return (    <body className={className}>
      <AIAdvisorProvider>
        <AuthProviderWrapper>          <div className="flex h-screen bg-white">
            <NavigationSidebar />
            <main className="flex-1 overflow-y-auto md:ml-0 bg-gray-50">
              {children}
            </main>
          </div>
          <FloatingLogoutWidget />
          <AIAdvisorWidget />
        </AuthProviderWrapper>
      </AIAdvisorProvider>
    </body>
  );
}
