"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";

export function WavyBackgroundcontent() {
  return (
    <WavyBackground className="max-w-4xl  mx-auto pb-40">
      <p className="text-2xl md:text-3xl lg:text-6xl text-white font-bold inter-var text-center">
        Empower Your Voice with Feedback Nexus
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of anonymous feedback to drive improvement and
        innovation.
      </p>
    </WavyBackground>
  );
}
