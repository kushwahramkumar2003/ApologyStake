"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WalletConnect } from "@/components/wallet-connect";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Menu, Shield, PlusCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import GitHubStats from "./GitHubStats";

const publicNavItems = [
  {
    title: "Features",
    items: [
      {
        title: "Secure Staking",
        href: "/#features",
        description: "Lock SOL or NFTs as collateral for your commitment",
      },
      {
        title: "Smart Contracts",
        href: "/#features",
        description: "Automated and transparent probation tracking",
      },
      {
        title: "Social Integration",
        href: "/#features",
        description: "Share your commitment journey on social media",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Documentation",
        href: "/docs",
        description: "Learn how to use ApologyStake effectively",
      },
      {
        title: "Blog",
        href: "/blog",
        description: "Latest updates and insights",
      },
      {
        title: "FAQ",
        href: "/#faq",
        description: "Common questions answered",
      },
    ],
  },
];

const privateNavItems = [
  {
    title: "My Stakes",
    href: "/dashboard",
  },
  {
    title: "Create New",
    href: "/create",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0); // Initialize width to 0
  const { connected } = useWallet();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);

      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isPrivateRoute = ["/dashboard", "/create", "/apology"].some((route) =>
    pathname.startsWith(route)
  );

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <Shield className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              ApologyStake
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {!isPrivateRoute && !connected && (
                <>
                  {publicNavItems.map((section) => (
                    <NavigationMenuItem key={section.title}>
                      <NavigationMenuTrigger>
                        {section.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {section.items.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {item.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </>
              )}

              {connected && (
                <>
                  {privateNavItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === item.href && "text-primary bg-accent"
                          )}
                        >
                          {item.title === "Create New" && (
                            <PlusCircle className="w-4 h-4 mr-2 inline-block" />
                          )}
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {width > 480 && (
            <>
              <ThemeToggle />
              <GitHubStats />
            </>
          )}

          <WalletConnect />

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary/10 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                {!isPrivateRoute && !connected && (
                  <>
                    {publicNavItems.map((section) => (
                      <div key={section.title} className="space-y-3">
                        <h4 className="font-medium text-primary">
                          {section.title}
                        </h4>
                        {section.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </>
                )}

                {connected && (
                  <>
                    {privateNavItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center text-sm font-medium transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.title === "Create New" && (
                          <PlusCircle className="w-4 h-4 mr-2" />
                        )}
                        {item.title}
                      </Link>
                    ))}
                  </>
                )}
                {width <= 480 && (
                  <div className="flex flex-col gap-2 items-center">
                    <ThemeToggle />
                    <GitHubStats />
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
