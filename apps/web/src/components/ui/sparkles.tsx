"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SparklesCore = React.memo(
  ({
    background,
    minSize,
    maxSize,
    particleDensity,
    className,
    particleColor,
    particleOffsetTop,
    particleOffsetBottom,
    particleOffsetHorizontal,
    speed,
  }: {
    background?: string;
    minSize?: number;
    maxSize?: number;
    particleDensity?: number;
    className?: string;
    particleColor?: string;
    particleOffsetTop?: number;
    particleOffsetBottom?: number;
    particleOffsetHorizontal?: number;
    speed?: number;
  }) => {
    const [particles, setParticles] = useState<
      { x: number; y: number; size: number }[]
    >([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const calculateDimensions = () => {
        const element = document.getElementById("sparkles-container");
        if (element) {
          const { width, height } = element.getBoundingClientRect();
          setDimensions({ width, height });
        }
      };

      calculateDimensions();
      window.addEventListener("resize", calculateDimensions);

      return () => {
        window.removeEventListener("resize", calculateDimensions);
      };
    }, []);

    useEffect(() => {
      if (dimensions.width === 0 || dimensions.height === 0) return;

      const particleCount = Math.floor(
        (dimensions.width * dimensions.height) / (particleDensity ?? 10000)
      );
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * dimensions.width + (particleOffsetHorizontal ?? 0),
          y:
            Math.random() *
              (dimensions.height -
                (particleOffsetTop ?? 0) -
                (particleOffsetBottom ?? 0)) +
            (particleOffsetTop ?? 0),
          size:
            Math.random() * ((maxSize ?? 3) - (minSize ?? 1)) + (minSize ?? 1),
        });
      }

      setParticles(newParticles);
    }, [
      dimensions,
      minSize,
      maxSize,
      particleDensity,
      particleOffsetTop,
      particleOffsetBottom,
      particleOffsetHorizontal,
    ]);

    return (
      <div
        id="sparkles-container"
        className={cn("h-full w-full", className)}
        style={{
          position: "relative",
          background: background ?? "transparent",
        }}
      >
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              y: [particle.y - 10, particle.y + 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: (speed ?? 2) + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: particleColor ?? "#fff",
            }}
          />
        ))}
      </div>
    );
  }
);

SparklesCore.displayName = "SparklesCore";

export const Sparkles = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  particleOffsetTop?: number;
  particleOffsetBottom?: number;
  particleOffsetHorizontal?: number;
  speed?: number;
}) => {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <SparklesCore {...props} />
      {children}
    </div>
  );
};
