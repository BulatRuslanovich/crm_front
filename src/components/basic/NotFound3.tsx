/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
  useTransform,
} from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Particle = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  const size = useMotionValue(Math.random() * 3 + 1);
  const opacity = useMotionValue(Math.random() * 0.5 + 0.1);

  const distance = useTransform([mouseX, mouseY, x, y], ([mx, my, px, py]) =>
    Math.sqrt((Number(mx) - Number(px)) ** 2 + (Number(my) - Number(py)) ** 2)
  );

  const scale = useTransform(distance, [0, 200], [2, 0.5], { clamp: true });

  useEffect(() => {
    const moveParticle = () => {
      animate(x, Math.random() * 100, {
        duration: Math.random() * 10 + 10,
        onComplete: moveParticle,
      });
      animate(y, Math.random() * 100, {
        duration: Math.random() * 10 + 10,
      });
    };
    moveParticle();
  }, []);

  // Convert x and y to percentage strings using useTransform
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);

  return (
    <motion.div
      className="absolute rounded-full bg-sky-400"
      style={{
        left,
        top,
        width: size,
        height: size,
        opacity,
        scale,
      }}
    />
  );
};

const FloatingCube = () => {
  return (
    <motion.div
      className="w-4 h-4 border border-sky-400 absolute"
      initial={{
        rotate: 0,
      }}
      animate={{
        rotate: 360,
        y: [0, -50, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

export default function NotFoundPage() {
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  const radius = useMotionValue(0);
  const backgroundOpacity = useMotionValue(0.1);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(56, 182, 255, 0.4), transparent 80%)`;

  useEffect(() => {
    // Initialize particles
    setParticles(
      Array.from({ length: 50 }, (_, i) => (
        <Particle key={i} mouseX={mouseX} mouseY={mouseY} />
      ))
    );

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      radius.set(Math.min(clientX * 0.3, 500));
      animate(backgroundOpacity, 0.3, { duration: 0.4 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>404 | Lost in the Void</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist in our digital universe"
        />
      </Head>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
        {/* Dynamic gradient background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background,
            opacity: backgroundOpacity,
          }}
        />

        {/* Particle system */}
        <div className="absolute inset-0 overflow-hidden">{particles}</div>

        {/* Floating cubes */}
        <FloatingCube />
        <FloatingCube />
        <FloatingCube />

        {/* Grid pattern with animation */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Main content */}
        <div className="max-w-2xl w-full space-y-8 relative z-10 px-4">
          <motion.div
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* 3D floating 404 text */}
            <motion.div
              className="relative inline-block perspective-1000"
              whileHover={{
                scale: 1.05,
              }}
            >
              <motion.span
                className="text-9xl font-bold mb-4 text-sky-500 block"
                initial={{
                  scale: 0.8,
                  opacity: 0,
                  rotateX: 45,
                  rotateY: -15,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotateX: 0,
                  rotateY: 0,
                  textShadow: [
                    "0 0 10px rgba(56, 182, 255, 0)",
                    "0 0 20px rgba(56, 182, 255, 0.7)",
                    "0 0 10px rgba(56, 182, 255, 0)",
                  ],
                }}
                transition={{
                  scale: { duration: 0.8, type: "spring" },
                  opacity: { duration: 0.6 },
                  rotateX: { duration: 1.2, type: "spring" },
                  rotateY: { duration: 1.2, type: "spring", delay: 0.2 },
                  textShadow: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              >
                404
              </motion.span>

              {/* Animated glitch effect */}
              <motion.span
                className="absolute inset-0 text-9xl font-bold text-sky-300 opacity-0 pointer-events-none"
                animate={{
                  opacity: [0, 0.7, 0],
                  x: [0, 5, -5, 0],
                  y: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.2, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                404
              </motion.span>
            </motion.div>

            <motion.h2
              className="text-4xl font-medium mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span className="text-sky-400 font-bold">
                HTTP_404_PORTAL_NOT_FOUND
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              {">"}_ The page you are looking for was not found.
              <br />
              {">"}_ Possible causes: broken link, mistyped URL,
              <br />
              {">"}_ or the resource has been moved or deleted.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <Link href="/" passHref>
                <motion.div
                  className="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 group relative overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(56, 182, 255, 0.6)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Return to Home</span>
                  <motion.span
                    className="relative z-10"
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    →
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
              </Link>

              <motion.button
                onClick={() => router.back()}
                className="px-8 py-3.5 bg-transparent border border-gray-700 hover:border-sky-400 text-gray-300 hover:text-sky-300 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(56, 182, 255, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Previous Destination</span>
                <motion.span
                  className="relative z-10"
                  animate={{
                    x: [0, -4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                >
                  ←
                </motion.span>
                <span className="absolute inset-0 bg-sky-900 opacity-0 hover:opacity-10 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Binary matrix rain */}
          <motion.div
            className="absolute -bottom-20 left-0 right-0 h-40 overflow-hidden opacity-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-sky-400 text-xs font-mono"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100 - 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
                animate={{
                  y: `+=${window.innerHeight + 200}`,
                }}
                transition={{
                  duration: 5 + Math.random() * 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {Math.random() > 0.5 ? "1" : "0"}
                {Math.random() > 0.7
                  ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
                  : ""}
              </motion.span>
            ))}
          </motion.div>

          {/* Status bar */}
          <motion.div
            className="absolute -bottom-4 left-0 right-0 text-center text-xs text-gray-500 font-mono "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            SYSTEM STATUS: <span className="text-sky-400">STABLE</span> |
            QUANTUM_CONNECTION: <span className="text-sky-400">ACTIVE</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
