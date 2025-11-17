"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedRootsLogo } from "./CSLogos/animated-logos";
import {
  MapPin,
  Globe,
  Users,
  Sparkles,
  MessageSquare,
  UserCircle,
  Shield,
  Network,
  Lock,
  Sprout,
  Send,
} from "lucide-react";

export default function PublicLandingPage() {
  const [email, setEmail] = useState("");

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signin page
    window.location.href = "/signin";
  };

  const cities = [
    { name: "Boston", members: "2,847" },
    { name: "London", members: "1,923" },
    { name: "Bengaluru", members: "3,156" },
    { name: "Amsterdam", members: "1,642" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Header for Homepage */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 flex items-center justify-center">
                <AnimatedRootsLogo size={28} />
              </div>
              <span className="text-xl font-normal">Central Square</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-base text-white hover:text-neutral-300">
                About
              </Link>
              <Link href="#" className="text-base text-white hover:text-neutral-300">
                Blog
              </Link>
              <Link href="#" className="text-base text-white hover:text-neutral-300">
                Contact
              </Link>
              <Link href="/signin" className="text-base text-white hover:text-neutral-300">
                Log In
              </Link>
              <Link
                href="/signin"
                className="bg-white text-neutral-900 px-6 py-2 rounded-full text-base font-normal hover:bg-neutral-100 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-white py-24 md:py-32 relative overflow-hidden">
        {/* Background Image - City Square */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/city-square.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/80 to-white/90"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <AnimatedRootsLogo size={96} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-normal text-neutral-900 mb-6 leading-tight"
          >
            Welcome to Central Square
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Where communities connect, deliberate, and build the future together. From city squares to the global agora, join a platform built for dialogue, trust, and collective growth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signin"
              className="bg-neutral-900 text-white px-8 py-4 rounded-full text-lg font-normal hover:bg-neutral-800 transition-colors"
            >
              Join the Square
            </Link>
            <Link
              href="/agora"
              className="border border-neutral-300 text-neutral-700 px-8 py-4 rounded-full text-lg font-normal hover:bg-neutral-50 transition-colors"
            >
              Explore the Platform
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-neutral-900 mb-4">
              The Architecture of Connection
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              A digital ecosystem designed for meaningful civic engagement and community building
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Local Squares */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/boston" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">Local Squares</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Connect with people in your city — build projects, host events, and solve problems together.
                </p>
              </Link>
            </motion.div>

            {/* Global Agora */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/agora" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">Global Agora</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Join worldwide dialogues shaping society's next chapter.
                </p>
              </Link>
            </motion.div>

            {/* Arcades */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/global/arcades" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">Arcades</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Organize and lead with others — start your own civic community.
                </p>
              </Link>
            </motion.div>

            {/* AI Host */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/ai-host" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">AI Host</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  A personal guide helping you discover communities and causes that match your values.
                </p>
              </Link>
            </motion.div>

            {/* Civic Feeds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/square" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">Civic Feeds</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Local and global conversations that matter to your community.
                </p>
              </Link>
            </motion.div>

            {/* Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/people" className="bg-neutral-50 rounded-2xl p-8 text-center hover:bg-neutral-100 transition-all hover:shadow-lg block">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-normal text-neutral-900 mb-4">Profiles</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Your civic identity — built through contribution, not clout.
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Across the Squares Section */}
      <section className="bg-neutral-50 py-20 relative">
        {/* Background decorative element */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-400 to-neutral-600"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-neutral-900 mb-4">
              Across the Squares
            </h2>
            <p className="text-xl text-neutral-600">
              A growing network of cities where digital meets civic
            </p>
          </motion.div>
          
          {/* City Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/${city.name.toLowerCase()}`}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all hover:scale-105 block"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-neutral-600" />
                  </div>
                  <h3 className="text-base font-normal text-neutral-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-neutral-600">{city.members} members</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Network Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-12"
          >
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl h-64 mb-6 relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="/images/earth-from-space.png"
                  alt="Global network"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-32 h-32 bg-neutral-400 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 right-4 w-40 h-40 bg-neutral-500 rounded-full blur-2xl"></div>
              </div>
            </div>
            <p className="text-lg text-neutral-600 text-center">
              Communities connecting across continents, building bridges through dialogue and shared purpose
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Makes Central Square Unique */}
      <section className="bg-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-normal text-neutral-900 mb-4">
              What Makes Central Square Unique
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Built for the future of civic engagement and community building
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Civic-by-Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Shield className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">Civic-by-Design</h3>
              <p className="text-base text-neutral-600">
                A social network built for dialogue, not division.
              </p>
            </motion.div>

            {/* Community-Led */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Users className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">Community-Led</h3>
              <p className="text-base text-neutral-600">
                Empowering local and global initiatives.
              </p>
            </motion.div>

            {/* AI for the Common Good */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Sparkles className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">AI for the Common Good</h3>
              <p className="text-base text-neutral-600">
                Your Host helps you discover meaningfully.
              </p>
            </motion.div>

            {/* Privacy-First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Lock className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">Privacy-First</h3>
              <p className="text-base text-neutral-600">
                No ads. No algorithms. Just community.
              </p>
            </motion.div>

            {/* Decentralized Ethos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Network className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">Decentralized Ethos</h3>
              <p className="text-base text-neutral-600">
                Built on open protocols and transparency.
              </p>
            </motion.div>

            {/* Rooted Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-neutral-200 transition-colors">
                <Sprout className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-3">Rooted Growth</h3>
              <p className="text-base text-neutral-600">
                Organic visual identity symbolizing collective evolution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <AnimatedRootsLogo size={32} />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-normal text-white mb-4"
          >
            Join the Conversation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto"
          >
            Be part of something bigger than social media — be part of the new public square.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <Link
              href="/signin"
              className="bg-white text-neutral-900 px-8 py-4 rounded-full text-lg font-normal hover:bg-neutral-100 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/boston"
              className="border border-neutral-600 text-white px-8 py-4 rounded-full text-lg font-normal hover:bg-neutral-800 transition-colors"
            >
              Discover Your City
            </Link>
          </motion.div>
          <form onSubmit={handleEarlyAccess} className="max-w-md mx-auto">
            <div className="flex rounded-full overflow-hidden bg-white">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get early access to your city"
                className="flex-1 px-6 py-4 text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <Send className="w-4 h-4 text-neutral-900" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4 md:mb-0 text-neutral-900"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <AnimatedRootsLogo size={24} />
              </div>
              <span className="text-xl font-normal">Central Square</span>
            </motion.div>
            <nav className="flex flex-wrap gap-6 justify-center md:justify-end">
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                About
              </Link>
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                Blog
              </Link>
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                Contact
              </Link>
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                Support
              </Link>
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                Privacy Policy
              </Link>
              <Link href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                Terms
              </Link>
            </nav>
          </div>
          <div className="border-t border-neutral-100 pt-8">
            <p className="text-base text-neutral-600 text-center">
              Central Square © 2025 – Building the world's digital commons.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
