"use client"
import { GL } from "./gl"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ParticlesBackground from "./particles-background"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  const [startVisuals, setStartVisuals] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Delay visuals by exactly 5.758 seconds
    const timer = setTimeout(() => {
      setStartVisuals(true)
    }, 5758)

    // Attempt to play audio
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented. User interaction is required to play audio.")
          // Optional: Add a UI element to ask user to play if needed
        })
      }
    }

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col h-svh justify-between relative bg-black">
      {/* Background Music */}
      <audio ref={audioRef} src="/music/mus.mp3" loop />

      <AnimatePresence>
        {/* Temp Background Layer (Visible initially, fades out) */}
        {!startVisuals && (
          <motion.div
            initial={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-1"
          >
            <ParticlesBackground
              particleCount={1000}
              noiseIntensity={0.001}
              className="bg-transparent"
            >
              {/* Empty children to override default text */}
              <></>
            </ParticlesBackground>
          </motion.div>
        )}

        {startVisuals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            {/* Video Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  opacity: 0.6,
                }}
              >
                <source src="/vid/mdia.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Image Overlay Layer with Blend Mode */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: "url(/images/iinsan.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.5,
                mixBlendMode: "overlay",
              }}
            />

            {/* Dark Overlay for Better Text Contrast */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
              }}
            />

            <GL hovering={hovering} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-16 pointer-events-none">
        <motion.div
          initial={{ y: "-45vh", scale: 1.5, opacity: 0 }}
          animate={{
            y: startVisuals ? 0 : "-45vh",
            scale: startVisuals ? 1 : 1.5,
            opacity: 1
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1], // Custom bezier for very smooth landing
            opacity: { duration: 1 }
          }}
          className="text-container pointer-events-auto flex flex-col items-center"
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl gradient-text glitch text-center"
            data-text="stay human"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            stay human
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: startVisuals ? "60%" : 0 }}
            transition={{ duration: 1, delay: startVisuals ? 0.5 : 0, ease: "easeOut" }}
            className="divider"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: startVisuals ? 1 : 0 }}
            transition={{ duration: 1, delay: startVisuals ? 0.2 : 0, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-balance mt-8 max-w-[440px] mx-auto glow-text text-center"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            stay tuned
          </motion.p>
        </motion.div>
      </div>

      <style jsx>{`
        .text-container {
          padding: 2.5rem 2rem;
          border-radius: 24px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 199, 0, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 60px rgba(255, 199, 0, 0.1);
          max-width: 90%;
          margin: 0 auto;
        }

        .gradient-text {
          position: relative;
          background: linear-gradient(
            135deg,
            #ffc700 0%,
            #ffed4e 25%,
            #ffc700 50%,
            #ff8c00 75%,
            #ffc700 100%
          );
          background-size: 300% 300%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 6s ease infinite;
          filter: drop-shadow(0 4px 24px rgba(255, 199, 0, 0.6))
                  drop-shadow(0 0 40px rgba(255, 199, 0, 0.3));
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        /* Glitch Effect */
        .glitch {
          position: relative;
        }
        
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit; /* Inherit gradient */
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.8;
        }

        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          animation: glitch-anim-1 3s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }

        .glitch::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9;
          animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
          clip-path: inset(0 0 0 0);
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
          100% { clip-path: inset(0% 0 80% 0); transform: translate(-1px, 1px); }
        }

        .divider {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 199, 0, 0.6),
            transparent
          );
          margin: 1.5rem auto;
          box-shadow: 0 0 20px rgba(255, 199, 0, 0.4);
        }

        .glow-text {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 
            0 0 20px rgba(255, 255, 255, 0.4),
            0 0 40px rgba(255, 199, 0, 0.3),
            0 0 60px rgba(255, 199, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.8);
          animation: glow-pulse 4s ease-in-out infinite;
          letter-spacing: 0.05em;
          font-weight: 300;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 0.4),
              0 0 40px rgba(255, 199, 0, 0.3),
              0 0 60px rgba(255, 199, 0, 0.2),
              0 2px 4px rgba(0, 0, 0, 0.8);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(255, 255, 255, 0.6),
              0 0 60px rgba(255, 199, 0, 0.5),
              0 0 90px rgba(255, 199, 0, 0.3),
              0 2px 4px rgba(0, 0, 0, 0.8);
          }
        }

        @media (max-width: 640px) {
          .text-container {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
