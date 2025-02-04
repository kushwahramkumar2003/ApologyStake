import { CreateApologyForm } from "@/components/create-apology-form";
import { WalletConnect } from "@/components/wallet-connect";

export default function CreatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-2xl font-bold">TAP</div>
          <WalletConnect />
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <CreateApologyForm />
        </div>
      </main>
    </div>
  );
}
