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
        <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center">
          <Meteors className="absolute inset-0 opacity-40" />
          <div className="container relative z-10 py-16 md:py-24 lg:py-32">
            <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-full"
              >
                <div
                  className={cn(
                    "group rounded-full border backdrop-blur-sm transition-all duration-300 ease-in hover:cursor-pointer border-indigo-500/30 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 hover:from-zinc-800/90 hover:to-zinc-700/90 hover:border-indigo-400/50 shadow-lg shadow-indigo-900/10"
                  )}
                >
                  <AnimatedShinyText className="text-zinc-100 inline-flex items-center justify-center px-5 py-1.5 transition-all ease-out duration-300 hover:text-white">
                    <Star className="h-4 w-4 mr-1.5 text-amber-400 drop-shadow-sm" />
                    Built on Solana
                    <Zap className="h-4 w-4 ml-1.5 text-indigo-400 drop-shadow-sm" />
                  </AnimatedShinyText>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-8 w-full"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  <TextAnimate
                    animation="slideLeft"
                    by="word"
                    className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 text-white"
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
                className="flex flex-wrap justify-center gap-6 w-full pt-4"
              >
                <Button
                  size="lg"
                  className="rounded-full text-base h-12 px-8 hover:scale-105 transition-transform shadow-md"
                  asChild
                >
                  <Link href="/create">
                    Create Apology <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-base h-12 px-8 hover:scale-105 transition-transform backdrop-blur-sm bg-background/30 shadow-md"
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
        <section className="border-t border-primary/10">
          <div className="  py-16 md:py-24 lg:py-32 px-4">
            <div className="grid gap-8 lg:gap-12 md:grid-cols-2 items-stretch">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full bg-background/50 backdrop-blur border-primary/10 hover:border-rose-500/20 transition-all duration-300">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="destructive"
                        className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      >
                        The Problem
                      </Badge>
                      <XCircle className="h-5 w-5 text-rose-500" />
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
                          <span className="bg-rose-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-rose-500" />
                          </span>
                          <span>No real accountability</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-rose-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-rose-500" />
                          </span>
                          <span>Lack of measurable progress</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-rose-500/10 p-1 rounded-full mt-0.5">
                            <XCircle className="h-4 w-4 text-rose-500" />
                          </span>
                          <span>Difficult to rebuild trust</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full bg-background/50 backdrop-blur border-primary/10 hover:border-emerald-500/20 transition-all duration-300">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      >
                        Our Solution
                      </Badge>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
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
                          <span className="bg-emerald-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          </span>
                          <span>Verifiable commitments</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-emerald-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          </span>
                          <span>Smart contract enforcement</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-emerald-500/10 p-1 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
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
        <section className="  py-16 md:py-24 px-4">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="h-full border border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50
                    hover:from-zinc-800/90 hover:to-zinc-700/70 hover:border-indigo-500/30 hover:shadow-lg
                    hover:shadow-indigo-500/10 transition-all duration-300 group overflow-hidden relative"
                >
                  <div
                    className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 via-indigo-400/10 to-violet-500/20 opacity-0 
                    group-hover:opacity-100 blur-xl rounded-xl transition-all duration-700 group-hover:duration-500"
                  />

                  <CardHeader className="space-y-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <div
                        className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/30
                          group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300 ease-out"
                      >
                        <stat.icon className="h-5 w-5 text-zinc-400 group-hover:text-indigo-400 group-hover:animate-pulse transition-colors duration-300" />
                      </div>

                      <div
                        className="h-8 w-8 rounded-full bg-indigo-500/5 opacity-0 group-hover:opacity-30 
                        group-hover:animate-ping transition-all duration-1000 absolute top-0 right-0"
                      />
                    </div>

                    <CardTitle
                      className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent 
                              bg-gradient-to-br from-white via-zinc-200 to-zinc-400 
                              group-hover:from-white group-hover:via-white group-hover:to-indigo-400
                              transition-all duration-300"
                    >
                      {stat.value}
                    </CardTitle>

                    <CardDescription
                      className="text-sm sm:text-base text-zinc-400 
                              group-hover:text-zinc-100 transition-all duration-300"
                    >
                      {stat.label}
                    </CardDescription>

                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                        bg-gradient-to-r from-indigo-500/80 to-violet-500/50 
                        transition-all duration-700 ease-out"
                    />
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="  py-16 md:py-24 lg:py-32 px-4">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1 text-base border-indigo-500/20 bg-background/50 backdrop-blur"
            >
              Capabilities
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to make meaningful apologies
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="h-full border border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50
                        hover:from-zinc-800/90 hover:to-zinc-700/70 hover:border-amber-500/30 hover:shadow-lg
                        hover:shadow-amber-500/10 transition-all duration-300 group overflow-hidden relative"
                >
                  <div
                    className="absolute -inset-px bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-orange-500/20 opacity-0 
                        group-hover:opacity-100 blur-xl rounded-xl transition-all duration-700 group-hover:duration-500"
                  />

                  <CardHeader className="relative z-10 pt-8 pb-6">
                    <div
                      className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/30 w-fit
                          group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-300 ease-out mb-5"
                    >
                      <feature.icon className="h-6 w-6 text-zinc-400 group-hover:text-amber-400 transition-colors duration-300" />
                    </div>

                    <CardTitle
                      className="text-xl font-bold bg-clip-text text-transparent 
                              bg-gradient-to-br from-white via-zinc-200 to-zinc-400 
                              group-hover:from-white group-hover:via-white group-hover:to-amber-400
                              transition-all duration-300"
                    >
                      {feature.title}
                    </CardTitle>

                    <CardDescription
                      className="text-base text-zinc-400 mt-2.5
                              group-hover:text-zinc-200 transition-all duration-300"
                    >
                      {feature.description}
                    </CardDescription>

                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                        bg-gradient-to-r from-amber-500/80 to-orange-500/50 
                        transition-all duration-700 ease-out"
                    />
                  </CardHeader>

                  <div
                    className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/5 rounded-full opacity-0 
                      group-hover:opacity-100 blur-3xl group-hover:animate-slow-pulse transition-all duration-1000"
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="how-it-works"
          className="border-t border-zinc-800/40 relative overflow-hidden"
        >
          {/* <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-sky-500/5 to-zinc-900/0 pointer-events-none" /> */}

          <div className="py-16 md:py-24 lg:py-32 px-4 relative z-10">
            <motion.div
              className="text-center mb-16 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="px-4 py-1 text-base border-zinc-700/50 bg-zinc-900/50 text-zinc-400 backdrop-blur hover:border-sky-500/40"
              >
                Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                How It Works
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Simple steps to make your apology meaningful
              </p>
            </motion.div>

            <div className="grid gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-4 relative">
              {/* <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent hidden lg:block" /> */}

              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card
                    className="h-full border border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50
              hover:from-zinc-800/90 hover:to-zinc-700/70 hover:border-sky-500/30 hover:shadow-lg
              hover:shadow-sky-500/10 transition-all duration-300 group overflow-hidden"
                  >
                    <div
                      className="absolute -inset-px bg-gradient-to-r from-sky-500/20 via-sky-400/10 to-blue-500/20 opacity-0 
                group-hover:opacity-100 blur-xl rounded-xl transition-all duration-700 group-hover:duration-500"
                    />

                    <CardHeader className="text-center pb-2 relative z-10">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 rounded-full bg-sky-500/10 scale-0 opacity-0 
                      group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                          />

                          <div
                            className="relative p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/50
                      group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-all duration-300 ease-out
                      shadow-sm group-hover:shadow-sky-500/20"
                          >
                            <step.icon className="h-8 w-8 text-zinc-400 group-hover:text-sky-400 transition-colors duration-300" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div
                                className="w-1 h-1 rounded-full bg-sky-400 animate-sparkle absolute delay-75"
                                style={{ top: "20%", left: "25%" }}
                              />
                              <div
                                className="w-1 h-1 rounded-full bg-sky-400 animate-sparkle absolute delay-150"
                                style={{ top: "70%", left: "70%" }}
                              />
                              <div
                                className="w-1 h-1 rounded-full bg-sky-400 animate-sparkle absolute delay-300"
                                style={{ top: "30%", left: "80%" }}
                              />
                            </div>
                          </div>

                          <div
                            className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700/50 
                      flex items-center justify-center text-xs font-semibold text-zinc-400 
                      group-hover:bg-sky-500/20 group-hover:text-sky-400 group-hover:border-sky-500/50 transition-all duration-300"
                          >
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="absolute top-4 right-4 bg-zinc-900/70 border-zinc-700/50 text-zinc-400 
                    group-hover:bg-sky-500/10 group-hover:border-sky-500/30 group-hover:text-sky-400 transition-all duration-300"
                      >
                        {step.badge}
                      </Badge>

                      <CardTitle
                        className="text-xl font-semibold bg-clip-text text-transparent 
                  bg-gradient-to-br from-white via-zinc-200 to-zinc-400 
                  group-hover:from-white group-hover:via-white group-hover:to-sky-400
                  transition-all duration-300"
                      >
                        {step.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <p
                        className="text-zinc-400 text-base sm:text-lg text-center
                  group-hover:text-zinc-300 transition-all duration-300"
                      >
                        {step.description}
                      </p>
                    </CardContent>

                    <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden">
                      <div
                        className="w-0 group-hover:w-full h-full bg-gradient-to-r from-sky-500 via-blue-400 to-sky-500 
                  transition-all duration-700 ease-out"
                        style={{
                          clipPath: "url(#wave-path)",
                        }}
                      />
                    </div>

                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <clipPath id="wave-path">
                          <path d="M0,0 Q5,0.5 10,0 T20,0 T30,0 T40,0 T50,0 T60,0 T70,0 T80,0 T90,0 T100,0 V1 H0 Z" />
                        </clipPath>
                      </defs>
                    </svg>

                    <div
                      className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-500/5 rounded-full opacity-0 
                group-hover:opacity-100 blur-3xl group-hover:animate-slow-pulse transition-all duration-1000"
                    />
                  </Card>

                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/3 z-10">
                      <div className="relative flex items-center justify-center">
                        <div className="w-12 h-px bg-sky-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <ArrowRight className="h-5 w-5 text-sky-500/70 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "12rem" }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center mt-12"
            >
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-sm border border-zinc-700/50 bg-zinc-900/50 text-zinc-300 
          hover:bg-sky-500/10 hover:border-sky-500/50 hover:text-sky-400 transition-all duration-300 group"
                asChild
              >
                <Link href="/process">
                  Learn More About Our Process
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
        </section>

        <section
          id="use-cases"
          className="py-16 md:py-24 lg:py-32 px-4 border-t border-zinc-800/40"
        >
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1 text-base border-zinc-700/50 bg-zinc-900/50 text-zinc-400 backdrop-blur hover:border-indigo-500/40"
            >
              Applications
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Use Cases
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Real-world applications of ApologyStake
            </p>
          </motion.div>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Personal Relationships",
                description:
                  "Rebuild trust with friends and family through meaningful actions and accountable promises",
                color: "indigo",
              },
              {
                icon: Shield,
                title: "Professional Setting",
                description:
                  "Address workplace conflicts with transparent and accountable resolutions",
                color: "violet",
              },
              {
                icon: Award,
                title: "Community Reconciliation",
                description:
                  "Facilitate healing in community disputes through transparent action and measurable change",
                color: "purple",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full border border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50
            hover:from-zinc-800/90 hover:to-zinc-700/70 hover:border-${useCase.color}-500/30 hover:shadow-lg
            hover:shadow-${useCase.color}-500/10 transition-all duration-300 group overflow-hidden relative`}
                >
                  <div
                    className={`absolute -inset-px bg-gradient-to-r from-${useCase.color}-500/20 via-${useCase.color}-400/10 to-${useCase.color}-600/20 opacity-0 
              group-hover:opacity-100 blur-xl rounded-xl transition-all duration-700 group-hover:duration-500`}
                  />

                  <CardHeader className="relative z-10 p-6 md:p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div
                        className={`p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/50
                  group-hover:bg-${useCase.color}-500/10 group-hover:border-${useCase.color}-500/50 transition-all duration-300 ease-out
                  relative overflow-hidden`}
                      >
                        <div
                          className={`absolute inset-0 bg-${useCase.color}-500/5 scale-0 group-hover:scale-150 opacity-0 
                    group-hover:opacity-100 transition-all duration-700 rounded-full`}
                        />

                        <useCase.icon
                          className={`h-10 w-10 text-zinc-400 group-hover:text-${useCase.color}-400 transition-colors duration-300 relative z-10`}
                        />
                      </div>

                      <CardTitle
                        className={`text-xl font-bold bg-clip-text text-transparent 
                  bg-gradient-to-br from-white via-zinc-200 to-zinc-400 
                  group-hover:from-white group-hover:via-white group-hover:to-${useCase.color}-400
                  transition-all duration-300`}
                      >
                        {useCase.title}
                      </CardTitle>

                      <CardDescription
                        className="text-base text-zinc-400 mt-1.5
                  group-hover:text-zinc-200 transition-all duration-300"
                      >
                        {useCase.description}
                      </CardDescription>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className={`w-1 h-1 rounded-full bg-${useCase.color}-400 animate-sparkle absolute delay-75`}
                        style={{ top: "20%", left: "25%" }}
                      />
                      <div
                        className={`w-1 h-1 rounded-full bg-${useCase.color}-400 animate-sparkle absolute delay-150`}
                        style={{ top: "70%", left: "70%" }}
                      />
                      <div
                        className={`w-1 h-1 rounded-full bg-${useCase.color}-400 animate-sparkle absolute delay-300`}
                        style={{ top: "30%", left: "80%" }}
                      />
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                bg-gradient-to-r from-${useCase.color}-500/80 to-${useCase.color}-600/50 
                transition-all duration-700 ease-out`}
                    />
                  </CardHeader>

                  <div
                    className={`absolute -bottom-20 -right-20 w-40 h-40 bg-${useCase.color}-500/5 rounded-full opacity-0 
              group-hover:opacity-100 blur-3xl group-hover:animate-slow-pulse transition-all duration-1000`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 grid gap-6 md:grid-cols-2"
          >
            <Card className="border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Real User Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-zinc-400 group-hover:text-zinc-300 transition-all duration-300">
                <blockquote className="border-l-2 border-indigo-500/30 pl-4 italic">
                  &quot;After our argument, words weren&apos;t enough. I staked
                  2 SOL for 30 days and completed therapy sessions. The
                  transparency rebuilt our friendship.&quot;
                </blockquote>
                <p className="text-right text-sm">— Jamie, Boston</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800/60 backdrop-blur-sm bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 hover:border-violet-500/30 transition-all duration-300 group overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-zinc-400 group-hover:text-zinc-300 transition-all duration-300">
                <blockquote className="border-l-2 border-violet-500/30 pl-4 italic">
                  &quot;Our neighborhood dispute over noise complaints was
                  resolved when the building manager staked an NFT and committed
                  to new quiet hours policy.&quot;
                </blockquote>
                <p className="text-right text-sm">— Resident Association</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden border-t border-zinc-800/40 py-16 md:py-24 lg:py-32">
          <div className="px-4  z-10">
            <motion.div
              className="mx-auto max-w-4xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-all duration-700" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-slow-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-slow-pulse delay-700" />

              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <Badge
                  variant="outline"
                  className="px-4 py-1 text-base border-indigo-500/30 bg-zinc-900/80 text-zinc-100 backdrop-blur"
                >
                  Take Action Today
                </Badge>

                <div>
                  <TextAnimate
                    animation="slideDown"
                    by="word"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400"
                  >
                    Ready to Make Things Right?
                  </TextAnimate>

                  <p className="mt-6 text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                    Transform your apologies into meaningful actions and rebuild
                    trust through verifiable commitments on the blockchain.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <Button
                    size="lg"
                    className="rounded-full text-base h-12 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/create">
                      Create Apology <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-base h-12 px-6 border-indigo-500/30 text-zinc-100 backdrop-blur-sm bg-zinc-900/50 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-400 hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/learn">
                      Learn More <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 mt-4 border-t border-zinc-800/60">
                  {[
                    { icon: Star, label: "Build Genuine Trust" },
                    { icon: Zap, label: "Transparent Accountability" },
                    { icon: CheckCircle2, label: "Verifiable Growth" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center gap-2 text-zinc-300"
                    >
                      <item.icon className="h-4 w-4 text-indigo-400" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-primary/10 ">
          <div className=" py-16 md:py-24 lg:py-32 px-4">
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
