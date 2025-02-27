import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ApologyStake</h3>
            <p className="text-sm text-muted-foreground">
              Making apologies meaningful through blockchain accountability.
            </p>
            <div>
              <Image
                src="/solana-powered.svg"
                width={120}
                height={30}
                alt="ApologyStake"
              />
            </div>
            <div className="flex gap-4">
              <Link href="https://twitter.com" target="_blank">
                <FaXTwitter size={22} />
                <span className="sr-only">Twitter</span>
              </Link>

              <Link href="https://github.com" target="_blank">
                <FaGithub size={22} />
                <span className="sr-only">GitHub</span>
              </Link>

              <Link href="https://discord.com" target="_blank">
                <FaDiscord size={22} />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="#how-it-works">How it Works</Link>
              </li>
              <li>
                <Link href="#use-cases">Use Cases</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#faq">FAQ</Link>
              </li>
              <li>
                <Link href="/docs">Documentation</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and new features.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 ApologyStake. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
