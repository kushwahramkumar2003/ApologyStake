"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "@/components/ui/sparkles";
import {
  ArrowRight,
  Shield,
  Users,
  Wallet,
  Award,
  CheckCircle2,
  Timer,
  Share2,
} from "lucide-react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const features = [
  {
    icon: Shield,
    title: "Secure Staking",
    description:
      "Lock SOL or NFTs in smart contracts as collateral for your commitment",
  },
  {
    icon: Timer,
    title: "Probation Period",
    description: "Set customizable timeframes to demonstrate improved behavior",
  },
  {
    icon: Share2,
    title: "Social Integration",
    description: "Share your commitment on social media with NFT certificates",
  },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "$2M+", label: "Total Staked" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "Support" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <BackgroundBeams className="absolute inset-0" />
          <div className="container relative z-10 py-24 md:py-32 space-y-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-1 backdrop-blur-sm bg-background/30"
                >
                  Built on Solana
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-4xl space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  <TextGenerateEffect words="Transform Apologies into Actions" />
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ApologyStake revolutionizes reconciliation through blockchain
                  technology. Stake SOL to prove your commitment to change and
                  rebuild trust with meaningful accountability.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/create">
                    Create Apology <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="border-t bg-muted/50">
          <div className="container py-16 md:py-24">
            <TracingBeam>
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter">
                    The Problem
                  </h2>
                  <p className="text-muted-foreground">
                    Traditional apologies often lack accountability and
                    measurable commitment to change. Words alone can feel empty,
                    making it difficult for victims to trust and move forward.
                  </p>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Our Solution
                  </h2>
                  <p className="text-muted-foreground">
                    ApologyStake introduces a blockchain-based system where
                    offenders stake assets as collateral for their commitment to
                    change, creating real accountability and incentives for
                    genuine improvement.
                  </p>
                </div>
              </div>
            </TracingBeam>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-3xl font-bold">
                      {stat.value}
                    </CardTitle>
                    <CardDescription>{stat.label}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to make meaningful apologies
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative overflow-hidden">
                  <Sparkles
                    className="absolute inset-0"
                    particleColor="var(--primary)"
                    particleDensity={200}
                    speed={0.5}
                    minSize={0.5}
                    maxSize={1}
                    particleOffsetTop={0}
                    particleOffsetBottom={0}
                  />
                  <CardHeader className="relative">
                    <feature.icon className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="border-t bg-muted/50">
          <div className="container py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                Simple steps to make your apology meaningful
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <Wallet className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Link your Solana wallet to get started
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Stake Assets</h3>
                <p className="text-muted-foreground">
                  Lock SOL or NFTs as commitment collateral
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Prove Growth</h3>
                <p className="text-muted-foreground">
                  Demonstrate improved behavior during probation
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <Award className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Reclaim Stake</h3>
                <p className="text-muted-foreground">
                  Get your assets back after successful completion
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="container py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Use Cases
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real-world applications of ApologyStake
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Personal Relationships</CardTitle>
                <CardDescription>
                  Rebuild trust with friends and family through meaningful
                  actions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Professional Setting</CardTitle>
                <CardDescription>
                  Address workplace conflicts with accountable resolutions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Community Reconciliation</CardTitle>
                <CardDescription>
                  Facilitate healing in community disputes and misunderstandings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t bg-muted/50">
          <div className="container py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Common questions about ApologyStake
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does staking work?</AccordionTrigger>
                  <AccordionContent>
                    Staking involves locking your SOL or NFTs in a smart
                    contract for a set period. The assets serve as collateral
                    for your commitment to change and can be reclaimed after
                    successful completion of the probation period.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What happens to staked assets?
                  </AccordionTrigger>
                  <AccordionContent>
                    Staked assets are held securely in a smart contract. If you
                    complete the probation period successfully, you can reclaim
                    them. If not, the victim can claim the assets as
                    compensation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How long is the probation period?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can choose between 7, 30, or 90 days for the probation
                    period. This timeframe should be agreed upon by both parties
                    involved.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my information public?</AccordionTrigger>
                  <AccordionContent>
                    While blockchain transactions are public, you control what
                    information is shared on social media. The apology NFT
                    content is customizable to maintain appropriate privacy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Make Things Right?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Start your journey towards meaningful reconciliation today.
            </p>
            <Button size="lg" asChild>
              <Link href="/create">
                Create Your First Apology{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
