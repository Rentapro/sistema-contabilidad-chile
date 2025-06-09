'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import AppShell from "@/components/AppShell";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export default function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  return (
    <AuthProvider>
      <AppShell>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
