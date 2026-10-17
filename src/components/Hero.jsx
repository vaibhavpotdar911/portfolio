import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Copy, Check, Sparkles } from 'lucide-react';

const WORDS = [
  'just work.',
  'solve real problems.',
  'scale effortlessly.',
  'ship with speed.',
  'bring ideas to life.'
];

export default function Hero({ onOpenSearch, appCount }) {
  const [copied, setCopied] = useState(false);
  const email = "vaibhav.potdar9946@gmail.com";

  // Typographical Typewriter Effect
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timer;

    if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
      timer = setTimeout(() => {}, 300);
    } else {
      const speed = isDeleting ? 38 : 75;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#fefefe]">
      {/* Ambient colorful background mesh orbs */}
      <div className="absolute top-12 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-200/40 via-indigo-100/35 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-36 right-10 w-[24rem] h-[24rem] bg-gradient-to-bl from-violet-200/35 via-purple-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Introduction & Primary Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:order-1">
            
            {/* Friendly Colorful Badge */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 text-blue-800 text-xs mb-5 w-fit font-medium shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal Workspace &amp; Applications Hub</span>
            </motion.div>

            {/* Main Headline with Dynamic Typographical Color Effect */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 leading-[1.14] mb-5 min-h-[3.3em] sm:min-h-[2.8em] lg:min-h-[2.4em]"
            >
              Building software and digital tools that{' '}
              <span className="inline-flex items-baseline border-b-2 border-indigo-200 pb-0.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 font-extrabold">
                  {displayText}
                </span>
                <span className="inline-block w-[2.5px] h-[0.85em] bg-indigo-600 ml-1 rounded-full animate-pulse" />
              </span>
            </motion.h1>

            {/* Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl"
            >
              Hi, I'm Vaibhav. This is my central launchpad for everything I develop and host. Jump directly into any live application, service, or tool below.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10"
            >
              {/* Primary: Jump to Apps with vibrant gradient */}
              <a
                href="#apps-section"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5"
              >
                <span>Browse Applications</span>
                <ArrowDown className="w-4 h-4 opacity-80" />
              </a>

              {/* Quick Search Shortcut */}
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium text-sm transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <span>Quick Search</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-xs font-mono text-slate-500">
                  ⌘K
                </kbd>
              </button>

              {/* Copy Contact Email */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 text-blue-800 text-xs font-medium transition-all duration-200 cursor-pointer shadow-2xs"
                title="Copy direct email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Clean Colorful Metrics Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="grid grid-cols-3 gap-3 max-w-lg pt-6 border-t border-slate-200/80"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {appCount}+
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Live Applications</span>
              </div>
              <div className="flex flex-col border-x border-slate-200/80 px-4">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600">
                  1-Click
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Direct Launch</span>
              </div>
              <div className="flex flex-col pl-4">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
                  Active
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Always Online</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Seamless Cutout Portrait (Zero Box, Matched #FEFEFE) */}
          <div className="lg:col-span-5 flex justify-center items-end order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md flex flex-col items-center"
            >
              {/* Seamless Portrait Container */}
              <div className="relative w-full overflow-hidden bg-[#fefefe] [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)]">
                <img
                  src="/professional-image.jpg"
                  alt="Vaibhav Potdar"
                  className="w-full h-auto object-contain portrait-blend contrast-[1.02] filter"
                  onError={(e) => {
                    e.target.src = "/src/assets/professional-image.jpg";
                  }}
                />
              </div>

              {/* Clean approachable name badge with colorful accent */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-[-16px] z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-md shadow-indigo-500/10"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">
                  Vaibhav Potdar
                </span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
