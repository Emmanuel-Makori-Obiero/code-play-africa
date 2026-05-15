import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Environment, Sparkles } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Emmanuel Makori Obiero — Portfolio" },
      { name: "description", content: "Software developer building ethical, AI-driven solutions. Portfolio of Emmanuel Makori Obiero." },
      { property: "og:title", content: "Emmanuel Makori Obiero — Portfolio" },
      { property: "og:description", content: "Software developer · AI · VR · Product strategy." },
    ],
  }),
  component: PortfolioPage,
});

/* ---------- 3D ---------- */
function FloatingBlob({ position, color, speed = 1, scale = 1 }: { position: [number, number, number]; color: string; speed?: number; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial color={color} distort={0.45} speed={2} roughness={0.2} metalness={0.6} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffb37a" />
      <pointLight position={[-5, -3, 2]} intensity={2} color="#ff6a3d" />
      <pointLight position={[4, -2, -2]} intensity={1.5} color="#ffd28a" />
      <FloatingBlob position={[-2.4, 0.8, 0]} color="#ff7a45" speed={0.8} scale={1.1} />
      <FloatingBlob position={[2.2, -0.6, -0.5]} color="#f5b06a" speed={1.2} scale={0.9} />
      <FloatingBlob position={[0, 1.8, -1.5]} color="#ffd28a" speed={0.6} scale={0.6} />
      <Sparkles count={80} size={3} speed={0.5} scale={[10, 6, 6]} color="#ffcfa1" />
      <Stars radius={40} depth={30} count={1500} factor={3} fade speed={1} />
      <Environment preset="sunset" />
    </>
  );
}

function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#3a1a0c,transparent_70%)]" />;
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 5], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

/* ---------- Navbar ---------- */
const SECTIONS = ["about", "education", "skills", "goals", "projects", "contact"] as const;

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "py-2 backdrop-blur-xl" : "py-4"}`}
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(40,16,8,0.85), rgba(40,16,8,0.65))"
          : "linear-gradient(180deg, rgba(40,16,8,0.4), transparent)",
        borderBottom: scrolled ? "1px solid rgba(255,180,120,0.18)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center gap-4">
        <a href="#top" className="font-extrabold tracking-tight text-lg">
          <span style={{ color: "#ffd28a" }}>Em</span>
          <span style={{ color: "#ff8a4c" }}>.</span>
          <span style={{ color: "#fff1dc" }}>Makori</span>
        </a>
        <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="px-3 py-2 rounded-full font-semibold capitalize transition-colors hover:bg-[rgba(255,180,120,0.12)]"
              style={{ color: "#ffe9cf" }}
            >
              {s}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="ml-auto hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm pop"
          style={{ background: "linear-gradient(135deg,#ff8a4c,#ffb86b)", color: "#2a1207", boxShadow: "0 10px 30px -10px rgba(255,138,76,.7)" }}
        >
          Hire me →
        </a>
        <button
          aria-label="menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden ml-auto p-2 rounded-lg"
          style={{ background: "rgba(255,180,120,0.12)", color: "#ffe9cf" }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 rounded-2xl p-3 flex flex-col gap-1"
          style={{ background: "rgba(40,16,8,0.95)", border: "1px solid rgba(255,180,120,0.2)" }}
        >
          {SECTIONS.map((s) => (
            <a key={s} href={`#${s}`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg capitalize font-semibold" style={{ color: "#ffe9cf" }}>
              {s}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}

/* ---------- Sections ---------- */
function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative max-w-6xl mx-auto px-5 py-24 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        {kicker && <div className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#ff8a4c" }}>{kicker}</div>}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight" style={{ color: "#fff1dc" }}>{title}</h2>
        {children}
      </motion.div>
    </section>
  );
}

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl p-6 ${className}`}
      style={{
        background: "linear-gradient(160deg, rgba(74,30,12,0.7), rgba(40,16,8,0.6))",
        border: "1px solid rgba(255,180,120,0.18)",
        boxShadow: "0 20px 50px -25px rgba(255,120,60,0.4), inset 0 1px 0 rgba(255,210,140,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);

  const certs = [
    { name: "Software Development (in progress)", org: "GOMYCODE", year: "2026" },
    { name: "ICDL 1 & 2", org: "Kenyatta University", year: "2026" },
    { name: "ITE", org: "AFRALTI", year: "2026" },
    { name: "KCSE", org: "Moi Forces Nairobi", year: "2025" },
    { name: "KCPE", org: "Nairobi Primary School", year: "2020" },
  ];

  const skills = [
    { name: "Software Development", icon: "💻" },
    { name: "AI & Product Strategy", icon: "🧠" },
    { name: "Digital Security Consulting", icon: "🛡️" },
    { name: "Computer Hardware Repair", icon: "🛠️" },
    { name: "Microsoft Word / Excel / Power BI", icon: "📊" },
    { name: "Chess", icon: "♟️" },
  ];

  return (
    <div id="top" className="min-h-screen overflow-x-hidden" style={{
      background: "radial-gradient(ellipse at 20% -10%, #5b2410 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, #3d1608 0%, transparent 50%), linear-gradient(180deg,#1a0a04,#2a1207 60%,#1a0a04)",
      color: "#fff1dc",
    }}>
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center">
        <div className="absolute inset-0">
          <Hero3D />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(26,10,4,0.7) 80%)",
        }} />
        <motion.div style={{ y: heroY }} className="relative max-w-6xl mx-auto px-5 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: "rgba(255,180,120,0.12)", border: "1px solid rgba(255,180,120,0.25)", color: "#ffd28a" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ff8a4c" }} />
            Available for collaborations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] max-w-4xl"
          >
            <span style={{
              background: "linear-gradient(135deg, #fff1dc 0%, #ffd28a 40%, #ff8a4c 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Emmanuel Makori</span>
            <br />
            <span style={{ color: "#ffb37a" }}>Obiero.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 max-w-2xl text-lg md:text-xl"
            style={{ color: "#ffe9cf99" }}
          >
            Software developer crafting ethical, <span style={{ color: "#ffb37a" }}>AI-driven</span> products that bridge human intuition and machine efficiency — from Nairobi to the world.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#projects" className="px-6 py-3 rounded-full font-bold pop"
              style={{ background: "linear-gradient(135deg,#ff8a4c,#ffb86b)", color: "#2a1207", boxShadow: "0 16px 40px -16px rgba(255,138,76,.8)" }}>
              See my work
            </a>
            <a href="#contact" className="px-6 py-3 rounded-full font-bold pop"
              style={{ background: "rgba(255,210,140,0.08)", color: "#ffe9cf", border: "1px solid rgba(255,180,120,0.3)" }}>
              Get in touch
            </a>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase opacity-60">scroll ↓</div>
      </section>

      {/* About */}
      <Section id="about" title="About me" kicker="01 — Intro">
        <div className="grid md:grid-cols-3 gap-6">
          <GlowCard className="md:col-span-2">
            <p className="text-lg leading-relaxed" style={{ color: "#ffe9cfd9" }}>
              I'm a software developer on a mission to build ethical, AI-driven solutions that augment human capability.
              My long-term goal is launching a startup that fuses <strong style={{ color: "#ffb37a" }}>Virtual Reality</strong> and
              <strong style={{ color: "#ffb37a" }}> biometric analysis</strong> to solve real problems people actually feel.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: "#ffe9cfaa" }}>
              I learn fast, ship faster, and care about the human on the other side of the screen.
            </p>
          </GlowCard>
          <GlowCard>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ff8a4c" }}>Quick facts</div>
            <ul className="space-y-3 text-sm">
              <li>📍 Nairobi, Kenya</li>
              <li>🎓 ITE @ AFRALTI</li>
              <li>🚀 Building Eduvance</li>
              <li>♟️ Chess player</li>
            </ul>
          </GlowCard>
        </div>
      </Section>

      {/* Education */}
      <Section id="education" title="Education & Certificates" kicker="02 — Background">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlowCard className="h-full">
                <div className="text-xs font-bold tracking-widest" style={{ color: "#ff8a4c" }}>{c.year}</div>
                <div className="font-bold text-lg mt-1" style={{ color: "#fff1dc" }}>{c.name}</div>
                <div className="text-sm opacity-70 mt-1">{c.org}</div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills" kicker="03 — Toolbox">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <GlowCard>
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-bold" style={{ color: "#fff1dc" }}>{s.name}</div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Goals */}
      <Section id="goals" title="Career goals" kicker="04 — Vision">
        <GlowCard>
          <p className="text-lg leading-relaxed" style={{ color: "#ffe9cfd9" }}>
            To leverage my foundation in <strong style={{ color: "#ffb37a" }}>hardware (ITE)</strong> and <strong style={{ color: "#ffb37a" }}>software development</strong> to launch a tech startup creating ethical, AI-driven applications.
            I aim to design systems that bridge human intuition and machine efficiency — starting with my architectural work on the <strong style={{ color: "#ffd28a" }}>Eduvance</strong> project.
          </p>
        </GlowCard>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Selected work" kicker="05 — Projects">
        <motion.a
          href="https://eduvancereal.base44.app/"
          target="_blank" rel="noreferrer"
          whileHover={{ y: -8 }}
          className="block"
        >
          <GlowCard>
            <div className="flex items-start gap-6 flex-col md:flex-row">
              <div className="w-full md:w-48 h-32 rounded-xl flex items-center justify-center text-5xl"
                style={{ background: "linear-gradient(135deg,#ff8a4c,#5b2410)", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }}>
                🎓
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest" style={{ color: "#ff8a4c" }}>LIVE PROTOTYPE</div>
                <h3 className="text-2xl font-extrabold mt-1">Eduvance</h3>
                <p className="mt-2 leading-relaxed" style={{ color: "#ffe9cfb0" }}>
                  An educative app simplifying learning by integrating legacy methods with digital tools — mnemonics, songs, memory & reasoning games, an animation creator and a creativity space. Built to make education fun and build social confidence.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 font-bold text-sm" style={{ color: "#ffb37a" }}>
                  Visit live app →
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.a>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Let's build together" kicker="06 — Contact">
        <div className="grid md:grid-cols-2 gap-6">
          <GlowCard>
            <div className="space-y-4">
              <a href="mailto:elmakobiero@gmail.com" className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,180,120,0.15)" }}>✉️</span>
                <div>
                  <div className="text-xs opacity-60 uppercase tracking-widest">Email</div>
                  <div className="font-bold group-hover:underline" style={{ color: "#ffd28a" }}>elmakobiero@gmail.com</div>
                </div>
              </a>
              <a href="tel:+254790558418" className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,180,120,0.15)" }}>📱</span>
                <div>
                  <div className="text-xs opacity-60 uppercase tracking-widest">Phone / WhatsApp</div>
                  <div className="font-bold group-hover:underline" style={{ color: "#ffd28a" }}>0790 558 418</div>
                </div>
              </a>
              <a href="https://github.com/Emmanuel-Makori-Obiero" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,180,120,0.15)" }}>🐙</span>
                <div>
                  <div className="text-xs opacity-60 uppercase tracking-widest">GitHub</div>
                  <div className="font-bold group-hover:underline" style={{ color: "#ffd28a" }}>@Emmanuel-Makori-Obiero</div>
                </div>
              </a>
              <a href="https://www.instagram.com/em.makori" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,180,120,0.15)" }}>📸</span>
                <div>
                  <div className="text-xs opacity-60 uppercase tracking-widest">Instagram</div>
                  <div className="font-bold group-hover:underline" style={{ color: "#ffd28a" }}>@em.makori</div>
                </div>
              </a>
            </div>
          </GlowCard>
          <GlowCard>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:elmakobiero@gmail.com?subject=Portfolio contact&body=${encodeURIComponent((e.currentTarget.elements.namedItem('msg') as HTMLTextAreaElement).value)}`; }}
              className="space-y-3">
              <input required placeholder="Full name" className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: "rgba(255,210,140,0.06)", border: "1px solid rgba(255,180,120,0.2)", color: "#fff1dc" }} />
              <input required type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl outline-none" style={{ background: "rgba(255,210,140,0.06)", border: "1px solid rgba(255,180,120,0.2)", color: "#fff1dc" }} />
              <textarea required name="msg" rows={4} placeholder="Your message…" className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{ background: "rgba(255,210,140,0.06)", border: "1px solid rgba(255,180,120,0.2)", color: "#fff1dc" }} />
              <button type="submit" className="w-full py-3 rounded-xl font-bold pop"
                style={{ background: "linear-gradient(135deg,#ff8a4c,#ffb86b)", color: "#2a1207", boxShadow: "0 14px 30px -12px rgba(255,138,76,.7)" }}>
                Send message
              </button>
            </form>
          </GlowCard>
        </div>
      </Section>

      <footer className="text-center py-10 text-sm opacity-50">
        © {new Date().getFullYear()} Emmanuel Makori Obiero · Crafted with warmth in Nairobi
      </footer>
    </div>
  );
}
