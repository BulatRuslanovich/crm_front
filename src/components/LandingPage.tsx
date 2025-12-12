"use client";

import Head from "next/head";
import {
  HeroSection,
  Footer,
} from "./marketing";
import Navbar from "./basic/Navbar";

export default function LandingPage() {

  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-black text-white`}
    >
      <Head>
        <title>FarmCRM</title>
        <meta
          name="description"
          content="FarmCRM"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="FarmCRM"
        />
        <meta
          property="og:description"
          content="FarmCRM"
        />
        <meta property="og:type" content="website" />
      </Head>

      <Navbar />
      <HeroSection />
      <Footer />
     </div>
  );
}
