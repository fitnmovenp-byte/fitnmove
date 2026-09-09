"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { LoginDialog } from "@/components/auth/login-dialog";
import { PaymentActivationModal } from "@/components/pro/payment-activation-modal";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [showPro, setShowPro] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#153D33] bg-[#041A15]/92 backdrop-blur supports-[backdrop-filter]:bg-[#041A15]/88">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#10372D]">
            <Image src="/icons/Logo.png" alt="" fill sizes="36px" className="object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-[#F4F8F5]">FitNMove</span>
            <span className="hidden text-xs text-[#C0D1CA] sm:block">Train. Move. Compete.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-[#C0D1CA] hover:bg-[#10372D] hover:text-[#B8F34A]">Home</Link>
          <Link href="/#features" className="rounded-lg px-3 py-2 text-sm font-medium text-[#C0D1CA] hover:bg-[#10372D] hover:text-[#B8F34A]">Features</Link>
          <a href="#community" className="rounded-lg px-3 py-2 text-sm font-medium text-[#C0D1CA] hover:bg-[#10372D] hover:text-[#B8F34A]">Community</a>
          <button type="button" onClick={() => setShowPro(true)} className="rounded-lg px-3 py-2 text-sm font-medium text-[#C0D1CA] hover:bg-[#10372D] hover:text-[#B8F34A]">Pro</button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#C8FA69] active:bg-[#9ED52E]"
          >
            <LogIn className="h-4 w-4" strokeWidth={1.8} />
            Sign in
          </Link>
        </div>
      </div>
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
      {showPro && <PaymentActivationModal onSignup={() => { setShowPro(false); setShowLogin(true); }} />}
    </nav>
  );
}
