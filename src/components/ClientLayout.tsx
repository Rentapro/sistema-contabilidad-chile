'use client';

import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import AIAdvisorProvider from "@/providers/AIAdvisorProvider";
import AIAdvisorWidget from '@/components/AIAdvisorWidget';

interface ClientLayoutProps {
  children: React.ReactNode;
  className: string;
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  return (
    <body className={className}>
      <AIAdvisorProvider>
        <AuthProviderWrapper>
          {children}
          <AIAdvisorWidget />
        </AuthProviderWrapper>
      </AIAdvisorProvider>
    </body>
  );
}
