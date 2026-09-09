import Link from "next/link";
import { PaymentActivationModal } from "@/components/pro/payment-activation-modal";

export default function PendingActivationPage() {
  return (
    <main className="premium-page-bg flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#DCE7DC] bg-[#F8FAF7] p-6 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Account pending</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Complete payment to activate Pro</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The payment guide is open. You can close it and return here anytime.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#DCE7DC] bg-white px-4 text-sm font-bold text-[#123F37] hover:bg-[#F1F6F1]">Back home</Link>
      </section>
      <PaymentActivationModal />
    </main>
  );
}
