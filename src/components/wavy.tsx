"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Boxes } from "./ui/background-boxes";

export function WavyBackgroundcontent() {
  return (
    <div className="relative w-full overflow-hidden py-20">
      {/* Animated background boxes */}
      <Boxes className="absolute inset-0 opacity-20" />

      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />

      {/* Animated spotlight effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Spotlight
        className="-bottom-40 right-0 md:right-60 md:-bottom-20"
        fill="white"
      />

      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-white/10 shadow-2xl">
            <h1 className="text-2xl md:text-3xl lg:text-6xl text-white font-bold inter-var text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Empower Your Voice with Feedback Nexus
            </h1>
            <p className="text-base md:text-lg mt-6 text-white/90 font-normal inter-var text-center max-w-2xl mx-auto">
              Leverage the power of anonymous feedback to drive improvement and
              innovation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
