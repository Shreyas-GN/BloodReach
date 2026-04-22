"use client";

import Link from "next/link";
import { AlertCircle, Heart, Droplet, Clock, CheckCircle2, ShieldCheck, ArrowRight, Activity, MapPin } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans selection:bg-crimson/30">
      
      {/* Precision Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group outline-none">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex items-center justify-center bg-rose-600/10 text-crimson rounded-xl p-1.5"
            >
              <Droplet className="w-5 h-5 fill-crimson stroke-crimson" />
            </motion.div>
            <span className="text-[17px] font-bold tracking-tight">
              PulseAid
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <SignedIn>
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </motion.button>
              </Link>
              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-lg" } }} />
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up">
                <motion.button 
                  whileHover={{ scale: 0.98, backgroundColor: "var(--color-crimson)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 transition-colors px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.05)]"
                >
                  I want to help
                </motion.button>
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>

      {/* Human Narrative Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center min-h-[calc(100vh-16rem)]">
          
          {/* Left: Typography & Intent */}
          <div className="lg:col-span-6 flex flex-col space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                14 people helped today
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-[1.05] text-zinc-900 dark:text-white text-balance">
                When someone needs blood, this is where <span className="text-crimson">help comes from.</span>
              </h1>
              
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed text-balance">
                You post in WhatsApp groups. You call everyone you know. It still takes too long. PulseAid gives willing donors a way to actually reach you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <SignedIn>
                <MotionLink 
                  href="/request/wizard"
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-crimson hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-[0_8px_30px_rgba(192,57,43,0.3)] transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Request blood for someone
                </MotionLink>
              </SignedIn>
              <SignedOut>
                <MotionLink 
                  href="/request/wizard"
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-crimson hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-[0_8px_30px_rgba(192,57,43,0.3)] transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Someone needs blood now
                </MotionLink>
                <Link href="/sign-up" className="flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
                  I want to help
                </Link>
              </SignedOut>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex items-center gap-6 pt-4 border-t border-zinc-200 dark:border-white/10"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-500">Nearby donors get notified instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-500">Someone accepted 4 minutes ago</span>
              </div>
            </motion.div>
          </div>

          {/* Right: The Relatable Live Card */}
          <div className="lg:col-span-6 relative w-full h-[500px] flex items-center justify-center lg:justify-end">
            
            {/* Ambient Background Glow */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold tracking-tight">
                            A+ needed
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Needed in the next few hours
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mb-8 space-y-4">
                        <h3 className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">Sarah Jenkins</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><MapPin className="w-4 h-4" /></div>
                                <span className="font-medium">City Hospital, Emergency Ward</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><Droplet className="w-4 h-4" /></div>
                                <span className="font-medium">2 units</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><Activity className="w-4 h-4" /></div>
                                <span className="font-medium">Notifying 12 donors nearby...</span>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="w-full py-4 rounded-2xl font-bold text-sm tracking-tight flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md cursor-default pointer-events-none">
                        I can help
                    </div>
                </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Feature Stream / Data Row (Humanized) */}
      <section className="border-t border-zinc-200/50 dark:border-white/5 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-white/5">
          <div className="pt-8 md:pt-0 md:px-8 first:pl-0 flex flex-col items-start text-left">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 mb-6">
              <Heart className="w-6 h-6 text-zinc-900 dark:text-zinc-100" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">You only see requests that need you</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">When someone needs blood, they don't have time to sort through incompatible offers. We only notify you if your blood group is a verified match.</p>
          </div>
          
          <div className="pt-8 md:pt-0 md:px-8 flex flex-col items-start text-left">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 mb-6">
              <Clock className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Creating a request takes 60 seconds</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">In an emergency, every second counts. Ask for help with just the patient name, hospital, and blood group. We handle the rest immediately.</p>
          </div>

          <div className="pt-8 md:pt-0 md:px-8 flex flex-col items-start text-left">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 mb-6">
              <MapPin className="w-6 h-6 text-rose-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Nearby donors get notified, not everyone</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">Our system finds willing donors who are close enough to the hospital to realistically get there in time. This prevents uncoordinated chaos.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-white/5 py-8 text-center text-sm text-zinc-500 font-medium pb-safe">
        PulseAid © 2026. Empowering communities to help each other.
      </footer>
    </div>
  );
}
