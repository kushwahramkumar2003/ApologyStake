"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import {
  Card,
  CardContent,
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
  Star,
  Zap,
  ArrowUpRight,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Meteors } from "@/components/magicui/meteors";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";

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
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "$2M+", label: "Total Staked", icon: Wallet },
  { value: "95%", label: "Success Rate", icon: CheckCircle2 },
  { value: "24/7", label: "Support", icon: Shield },
];

const howItWorks = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Solana wallet to get started",
    badge: "Step 1",
  },
  {
    icon: Shield,
    title: "Stake Assets",
    description: "Lock SOL or NFTs as commitment collateral",
    badge: "Step 2",
  },
  {
    icon: CheckCircle2,
    title: "Prove Growth",
    description: "Demonstrate improved behavior during probation",
    badge: "Step 3",
  },
  {
    icon: Award,
    title: "Reclaim Stake",
    description: "Get your assets back after successful completion",
    badge: "Step 4",
  },
];

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      <main className="flex flex-col justify-center">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] overflow-hidden flex items-center">
          <Meteors className="absolute inset-0 opacity-40 " />
          <div className="container relative z-10 py-16 md:py-24 lg:py-32">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="z-10 flex items-center justify-center">
                  <div
                    className={cn(
                      "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    )}
                  >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 " />
                      Built on Solana
                      <Zap className="h-4 w-4 ml-1 text-yellow-500 " />
                    </AnimatedShinyText>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                  <TextAnimate
                    animation="slideLeft"
                    by="word"
                    className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 text-black dark:text-white"
                  >
                    Transform Apologies into Actions
                  </TextAnimate>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
                  ApologyStake revolutionizes reconciliation through blockchain
                  technology. Stake SOL to prove your commitment to change and
                  rebuild trust with meaningful accountability.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 w-full"
              >
                <Button
                  size="lg"
                  className="rounded-full text-base h-12 px-6 hover:scale-105 transition-transform"
                  asChild
                >
                  <Link href="/create">
                    Create Apology <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-base h-12 px-6 hover:scale-105 transition-transform backdrop-blur-sm bg-background/30"
                  asChild
                >
                  <Link href="/dashboard">
                    View Dashboard <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        {/* <section className="border-t border-primary/10 ">
          <div className="container py-16 md:py-24 lg:py-32 px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
                  The Problem
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Traditional apologies often lack accountability and measurable
                  commitment to change. Words alone can feel empty, making it
                  difficult for victims to trust and move forward.
                </p>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
                  Our Solution
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  ApologyStake introduces a blockchain-based system where
                  offenders stake assets as collateral for their commitment to
                  change, creating real accountability and incentives for
                  genuine improvement.
                </p>
              </motion.div>
            </div>
          </div>
        </section> */}

        <section className="border-t border-primary/10">
          <div className="container py-16 md:py-24 lg:py-32 px-4">
            <div className="grid gap-8 lg:gap-12 md:grid-cols-2 items-stretch">
              {/* Problem Card */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full bg-background/50 backdrop-blur border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="destructive"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        The Problem
                      </Badge>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tighter">
                      Empty Words, <br />
                      <span className="text-muted-foreground">
                        Broken Trust
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                        Traditional apologies often lack accountability and
                        measurable commitment to change. Words alone can feel
                        empty, making it difficult for victims to trust and move
                        forward.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-red-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </span>
                          <span>No real accountability</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-red-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </span>
                          <span>Lack of measurable progress</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-red-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </span>
                          <span>Difficult to rebuild trust</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Solution Card */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full bg-background/50 backdrop-blur border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      >
                        Our Solution
                      </Badge>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tighter">
                      Blockchain-Backed <br />
                      <span className="text-muted-foreground">
                        Accountability
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                        ApologyStake introduces a blockchain-based system where
                        offenders stake assets as collateral for their
                        commitment to change, creating real accountability and
                        incentives for genuine improvement.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-green-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </span>
                          <span>Verifiable commitments</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-green-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </span>
                          <span>Smart contract enforcement</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-green-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </span>
                          <span>Transparent progress tracking</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-16 md:py-24 px-4">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/10 backdrop-blur-sm bg-background/30 hover:bg-background/40 transition-colors">
                  <CardHeader className="space-y-2">
                    <stat.icon className="h-6 w-6 text-primary/60" />
                    <CardTitle className="text-2xl sm:text-3xl font-bold">
                      {stat.value}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {stat.label}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container py-16 md:py-24 lg:py-32 px-4"
        >
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to make meaningful apologies
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="relative overflow-hidden h-full border-primary/10 backdrop-blur-sm bg-background/30">
                  <Sparkles
                    className="absolute inset-0"
                    particleColor="var(--primary)"
                    particleDensity={100}
                    speed={0.5}
                    minSize={0.5}
                    maxSize={1}
                  />
                  <CardHeader className="relative space-y-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl sm:text-2xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="border-t border-primary/10 ">
          <div className="container py-16 md:py-8 lg:py-32 px-4">
            <motion.div
              className="text-center mb-16 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="px-4 py-1 text-base border-primary/20 bg-background/50 backdrop-blur"
              >
                Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Simple steps to make your apology meaningful
              </p>
            </motion.div>

            <div className="grid gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-4 relative">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="h-full bg-background/50 backdrop-blur border-primary/10 hover:border-primary/20 transition-all duration-300 overflow-visible">
                    <CardHeader className="text-center pb-1">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                          <div className="relative bg-primary/10 p-4 rounded-xl transform -translate-y-2 group-hover:scale-110 transition-transform duration-300">
                            <step.icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="absolute top-4 right-4 bg-background/50"
                      >
                        {step.badge}
                      </Badge>
                      <CardTitle className="text-xl font-semibold">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base sm:text-lg text-center">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bottom Pattern */}
            <div className="mt-16 flex justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="h-px w-32 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              />
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section
          id="use-cases"
          className="container py-16 md:py-24 lg:py-32 px-4"
        >
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Use Cases
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
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

        {/* CTA Section */}
        <section className="container py-16 md:py-24 lg:py-32 px-4">
          <motion.div
            className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Make Things Right?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Start your journey towards meaningful reconciliation today.
            </p>
            <Button
              size="lg"
              className="rounded-full text-base h-12 px-6 hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/create">
                Create Your First Apology{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-primary/10 ">
          <div className="container py-16 md:py-24 lg:py-32 px-4">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
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
      </main>

      <SiteFooter />
    </div>
  );
}
