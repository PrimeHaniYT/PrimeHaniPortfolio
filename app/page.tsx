'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [isShowreelExpanded, setIsShowreelExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [typedText, setTypedText] = useState('');
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fullText = 'Premium Content Creator';

  // Typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const projects = [
    { id: 'project3', name: 'RECOIL Group – Sponsored Gameplay Edit', video: '/project3.mp4', description: 'Sponsored gameplay edit created for RECOIL Group featuring engaging pacing, cinematic transitions, subtitles, sound design, and high-retention editing.', sponsored: true },
    { id: 'project1', name: 'Project 1', video: '/project1.mp4.mp4' },
    { id: 'project2', name: 'Project 2', video: '/project2.mp4.mp4' },
  ];

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking with smooth spring animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile) return;
    
    setMousePosition({ x: e.clientX, y: e.clientY });
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsMoving(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 150);
  };

  useEffect(() => {
    if (isMobile) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMobile]);

  const handleVideoHover = (id: string) => {
    setHoveredVideo(id);
    if (videoRefs.current[id]) {
      videoRefs.current[id]?.play().catch((e) => {
        console.error(`Failed to play video ${id}:`, e);
      });
    }
  };

  const handleVideoLeave = (id: string) => {
    setHoveredVideo(null);
    if (videoRefs.current[id]) {
      videoRefs.current[id]?.pause();
      videoRefs.current[id]!.currentTime = 0;
    }
  };

  return (
    <div className="w-full bg-black text-white overflow-x-hidden">
      {/* Cursor Spotlight Effect - Desktop Only */}
      {!isMobile && (
        <>
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(220, 38, 38, 0.08), transparent 40%)`,
            }}
          />
          {/* Shimmer particles around cursor */}
          <motion.div
            className="fixed pointer-events-none z-40"
            style={{
              x: springX,
              y: springY,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500/30 rounded-full"
                animate={{
                  x: [0, (i - 1) * 20, 0],
                  y: [0, (i - 1) * 20, 0],
                  opacity: isMoving ? [0.3, 0.6, 0.3] : 0,
                  scale: isMoving ? [1, 1.5, 1] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-red-500"
            >
              PrimeHani
            </motion.span>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Work', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-900/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.3, 0.15],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-800/10 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        <div className="relative z-10 px-4 w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {/* Left Side - Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-center lg:text-left flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mb-6 relative"
              >
                {/* Cinematic glow behind profile */}
                <motion.div
                  animate={{
                    boxShadow: ['0 0 30px rgba(220,38,38,0.4)', '0 0 60px rgba(220,38,38,0.6)', '0 0 30px rgba(220,38,38,0.4)'],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-600/20 blur-xl -inset-2"
                />
                <img
                  src="/Profile.png.png"
                  alt="PrimeHani"
                  className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full border-4 border-red-500 mx-auto lg:mx-0 object-cover shadow-2xl shadow-red-500/30"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
              >
                <motion.span
                  className="text-white inline-block"
                  animate={{
                    textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.3)', '0 0 0px rgba(255,255,255,0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Prime
                </motion.span>
                <motion.span
                  className="text-red-500 inline-block"
                  animate={{
                    textShadow: ['0 0 0px rgba(220,38,38,0)', '0 0 30px rgba(220,38,38,0.5)', '0 0 0px rgba(220,38,38,0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  Hani
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 h-8"
              >
                <span className="text-red-400">{typedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-red-500 ml-1"
                />
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-sm sm:text-base text-gray-400 mb-6 max-w-md"
              >
                Professional Video Editor • Sponsored Content • Brand Collaborations
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-sm sm:text-base text-gray-300 mb-6 max-w-lg leading-relaxed"
              >
                I create high-performing gaming content that reaches hundreds of thousands of viewers while helping brands and game developers grow their communities through engaging sponsored content.
              </motion.p>

              {/* Stats Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
              >
                {[
                  {
                    icon: '�',
                    label: 'Gaming Creator',
                    highlight: false,
                  },
                  {
                    icon: '📺',
                    label: '14K+ Subscribers',
                    highlight: true,
                  },
                  {
                    icon: '🤝',
                    label: 'Brand Partner',
                    highlight: false,
                  },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`px-4 py-2 rounded-xl backdrop-blur-sm border transition-all ${
                      badge.highlight
                        ? 'bg-red-600/20 border-red-500/50 shadow-lg shadow-red-500/30'
                        : 'bg-gray-900/50 border-red-900/30 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{badge.icon}</span>
                      <span
                        className={`text-sm font-medium ${
                          badge.highlight ? 'text-red-400' : 'text-gray-300'
                        }`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220,38,38,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-center relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%]"
                    whileHover={{ translateX: ['100%', '-100%'] }}
                    transition={{ duration: 0.6 }}
                  />
                  Get In Touch
                </motion.a>
                <motion.a
                  href="#work"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220,38,38,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-all text-center relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent translate-x-[-100%]"
                    whileHover={{ translateX: ['100%', '-100%'] }}
                    transition={{ duration: 0.6 }}
                  />
                  View Work
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right Side - Featured Showreel Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex-shrink-0"
            >
              <motion.div
                animate={{
                  boxShadow: ['0 0 20px rgba(220,38,38,0.3)', '0 0 40px rgba(220,38,38,0.5)', '0 0 20px rgba(220,38,38,0.3)'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <div className="aspect-[9/16] w-48 sm:w-56 md:w-64 bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-red-500/50 overflow-hidden relative">
                  <video
                    src="/showreel.mp4.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  {/* Glow overlay */}
                  <div className="absolute inset-0 pointer-events-none rounded-3xl ring-2 ring-red-500/20 ring-inset" />
                </div>
              </motion.div>
              
              {/* Watch Showreel Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVideo('/showreel.mp4.mp4')}
                className="mt-6 w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Showreel
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-red-500/50 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-red-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* Trusted By Section */}
      <section id="trusted-by" className="w-full py-16 px-4 bg-black relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-400"
          >
            Trusted by Game Developers & Brands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-gray-400 text-center mb-8 max-w-2xl mx-auto"
          >
            Successfully partnered with RECOIL Group for sponsored promotional content.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5, boxShadow: '0 0 30px rgba(220,38,38,0.4)' }}
              className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-900/30 hover:border-red-500/50 transition-all cursor-pointer"
            >
              <img
                src="/recoil-logo.png.png"
                alt="RECOIL Group"
                className="w-32 sm:w-40 md:w-48 h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* About Me Section */}
      <section id="about" className="w-full py-20 px-4 bg-gradient-to-b from-black to-red-950/10 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 right-10 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-red-900/5 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto w-full text-center relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            <span className="text-red-500">About</span> Me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6"
          >
            I'm a <span className="text-red-400 font-semibold">Gaming Content Creator</span> and <span className="text-red-400 font-semibold">Professional Video Editor</span> passionate about creating high-performing content that captivates audiences and delivers results for brands.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6"
          >
            Specializing in <span className="text-red-400 font-semibold">Roblox</span> and <span className="text-red-400 font-semibold">Fortnite</span> content, I create engaging short-form videos that reach hundreds of thousands of viewers. My expertise includes sponsored content, high viewer retention editing, and professional brand collaborations.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed"
          >
            With a focus on fast turnaround, premium quality, and professional communication, I help game developers and brands grow their communities through authentic, high-impact content.
          </motion.p>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* Services Section */}
      <section id="services" className="w-full py-20 px-4 bg-black relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-4"
          >
            My <span className="text-red-500">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          >
            Premium content creation and video editing services for brands and game developers.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎬',
                title: 'Sponsored YouTube Shorts',
                description: 'High-impact sponsored content for your brand',
              },
              {
                icon: '📱',
                title: 'Sponsored TikTok Videos',
                description: 'Viral-ready TikTok content for maximum reach',
              },
              {
                icon: '🎮',
                title: 'Gameplay Showcases',
                description: 'Engaging gameplay highlights and montages',
              },
              {
                icon: '✂️',
                title: 'Professional Video Editing',
                description: 'Premium editing with cinematic effects',
              },
              {
                icon: '🚀',
                title: 'Brand Promotions',
                description: 'Strategic promotional content for growth',
              },
              {
                icon: '🎥',
                title: 'Trailer Editing',
                description: 'Compelling trailers that drive conversions',
              },
              {
                icon: '📊',
                title: 'Content Strategy',
                description: 'Data-driven content planning and optimization',
              },
              {
                icon: '🖼️',
                title: 'Thumbnail Design',
                description: 'Eye-catching thumbnails for higher CTR',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 0 25px rgba(220,38,38,0.3)' }}
                className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-900/30 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-4xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* Statistics Section */}
      <section id="stats" className="w-full py-20 px-4 bg-gradient-to-b from-black to-red-950/10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-12"
          >
            My <span className="text-red-500">Impact</span>
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '14K+', label: 'Subscribers', icon: '📺' },
              { value: '4M+', label: 'Total Views', icon: '👁️' },
              { value: '10+', label: 'Brand Collaborations', icon: '🤝' },
              { value: 'Millions', label: 'Impressions', icon: '📈' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-900/30 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-5xl sm:text-6xl font-bold text-red-500 mb-2"
                >
                  {stat.value}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-2xl mb-2"
                >
                  {stat.icon}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-gray-400"
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* Skills Section */}
      <section id="skills" className="w-full py-20 px-4 bg-black relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-4"
          >
            My <span className="text-red-500">Skills</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          >
            Professional tools and techniques I use to create stunning content.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Premiere Pro',
              'After Effects',
              'Motion Graphics',
              'Color Grading',
              'Sound Design',
              'Short Form Editing',
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-6 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-red-900/30 hover:border-red-500/50 hover:bg-red-950/30 transition-all cursor-pointer"
              >
                <span className="text-gray-300 font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* Brand Collaboration Process Section */}
      <section id="process" className="w-full py-20 px-4 bg-gradient-to-b from-black to-red-950/10 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-10 w-56 h-56 bg-red-900/5 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-4"
          >
            Brand <span className="text-red-500">Collaboration</span> Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-center mb-16 max-w-2xl mx-auto"
          >
            A professional workflow for sponsored content and brand partnerships.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '💬',
                title: 'Brand Contact',
                description: 'A game developer or brand contacts me, or I reach out for a sponsorship opportunity.',
              },
              {
                step: '02',
                icon: '🤝',
                title: 'Agreement & Payment',
                description: 'We agree on pricing, deliverables, posting schedule, and payment. Payment is completed before publishing the sponsored content.',
                highlight: true,
              },
              {
                step: '03',
                icon: '🎮',
                title: 'Content Creation',
                description: 'I record premium gameplay, edit a high-retention vertical video, and ensure the content matches the sponsor\'s goals.',
              },
              {
                step: '04',
                icon: '✅',
                title: 'Review & Approval',
                description: 'The sponsor reviews the video if required and approves the final version before publication.',
              },
              {
                step: '05',
                icon: '🚀',
                title: 'Publishing & Results',
                description: 'I publish the sponsored content across my platforms and provide performance statistics when needed.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  boxShadow: item.highlight 
                    ? '0 0 40px rgba(220,38,38,0.5)' 
                    : '0 0 30px rgba(220,38,38,0.3)'
                }}
                className={`group relative p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border transition-all cursor-pointer ${
                  item.highlight 
                    ? 'border-red-500/50 hover:border-red-500' 
                    : 'border-red-900/30 hover:border-red-500/50'
                }`}
              >
                {item.highlight && (
                  <motion.div
                    animate={{
                      boxShadow: ['0 0 20px rgba(220,38,38,0.3)', '0 0 40px rgba(220,38,38,0.5)', '0 0 20px rgba(220,38,38,0.3)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-red-600/5 blur-xl -z-10"
                  />
                )}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-4xl"
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-2xl font-bold text-red-500">Step {item.step}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                {item.highlight && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mt-4 pt-4 border-t border-red-500/30"
                  >
                    <span className="text-xs text-red-400 font-semibold">⚡ Payment required before upload</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-20"
      />

      {/* My Work Gallery Section */}
      <section id="work" className="w-full py-20 px-4 bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold text-center mb-4"
          >
            <span className="text-red-500">My</span> Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          >
            Explore my portfolio of video editing projects.
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -8, boxShadow: '0 0 30px rgba(220,38,38,0.4)' }}
                className="group relative aspect-[9/16] bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-900/30 overflow-hidden hover:border-red-500 transition-all cursor-pointer"
                onMouseEnter={() => handleVideoHover(project.id)}
                onMouseLeave={() => handleVideoLeave(project.id)}
                onClick={() => setSelectedVideo(project.video)}
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[project.id] = el;
                  }}
                  src={project.video}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={(e) => {
                    console.error(`Video ${project.id} failed to load:`, e);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all" />
                {project.sponsored && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/50"
                  >
                    Sponsored
                  </motion.div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.2 }}
                    className="text-red-500 text-xs font-medium mb-1"
                  >
                    {project.sponsored ? 'Sponsored Project' : 'Project'}
                  </motion.span>
                  <h3 className="text-base font-semibold text-white mb-1">{project.name}</h3>
                  {project.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="text-xs text-gray-400 line-clamp-2"
                    >
                      {project.description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-20 px-4 bg-gradient-to-b from-black to-red-950/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto w-full text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="text-red-500">Let's</span> Work Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Available for Sponsorships, Brand Deals, Promotional Campaigns, Professional Video Editing and Long-Term Partnerships.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: 'YouTube',
                handle: '@PrimeHaniYT',
                href: 'https://www.youtube.com/@PrimeHaniYT',
                color: 'bg-red-600',
                icon: (
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                ),
              },
              {
                name: 'Discord',
                handle: 'primehaniyt',
                href: 'https://discord.gg/',
                color: 'bg-indigo-600',
                icon: (
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0733 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.03z"/>
                ),
              },
              {
                name: 'Email',
                handle: 'haniasim533@gmail.com',
                href: 'mailto:haniasim533@gmail.com',
                color: 'bg-red-600',
                icon: (
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                ),
              },
            ].map((contact, index) => (
              <motion.a
                key={contact.name}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group p-6 bg-gray-900/50 border border-red-900/30 rounded-xl hover:border-red-500 hover:bg-red-950/30 transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${contact.color} flex items-center justify-center group-hover:brightness-110 transition-colors`}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {contact.icon}
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{contact.name}</h3>
                <p className="text-gray-400">{contact.handle}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-black border-t border-red-900/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto w-full text-center"
        >
          <p className="text-gray-400">
            © 2026 PrimeHani. All Rights Reserved.
          </p>
        </motion.div>
      </footer>

      {/* Video Modal/Lightbox - Vertical 9:16 */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-sm aspect-[9/16]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              src={selectedVideo}
              className="w-full h-full object-cover rounded-2xl"
              controls
              autoPlay
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
