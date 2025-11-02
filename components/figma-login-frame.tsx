"use client";

import { useState } from "react";
import Link from "next/link";

export default function FigmaLoginFrame() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function sendLink(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email) return;
    
    setSending(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Magic link error:", data);
        alert(`Error: ${data.error || "Failed to send magic link"}`);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      alert(`Error: ${err.message || "Failed to send magic link. Please check your connection."}`);
    } finally {
      setSending(false);
    }
  }

  function resetEmail() {
    setSent(false);
    setEmail("");
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[448px]">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-5">
            <div className="mb-6">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    d="M4 6h16v12H4zM22 6l-10 7L2 6" />
                </svg>
              </div>
              <h1 className="text-2xl text-neutral-900 mb-2">Check your inbox to continue</h1>
              <p className="text-neutral-600 text-sm">
                We've sent a secure link to <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-neutral-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                </svg>
                <div className="text-left">
                  <p className="text-sm text-neutral-700 mb-1">Didn't receive the email?</p>
                  <ul className="text-xs text-neutral-600 space-y-1">
                    <li>• Check your spam folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• The link expires in 15 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => sendLink()}
              disabled={sending}
              className="w-full border border-neutral-200 text-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Resend Link"}
            </button>

            <button onClick={resetEmail} className="text-neutral-600 hover:text-neutral-900 text-sm">
              Use a different email address
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Central Square
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[448px]">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-5">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-normal text-neutral-900 mb-2">
              Join Central Square
            </h1>
            
            <p className="text-sm text-neutral-600 mb-1">
              Enter your email to receive a magic link.
            </p>
            
            <p className="text-xs text-neutral-500">
              No passwords, no ads — just community.
            </p>
          </div>

          <form onSubmit={sendLink} className="space-y-6 mb-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm text-neutral-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-[50px] px-4 bg-neutral-50 border border-neutral-200 rounded-lg text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50"
                required
                disabled={sending}
              />
            </div>

            <button
              type="submit"
              disabled={sending || !email}
              className="w-full h-12 bg-neutral-900 text-white rounded-lg font-normal text-base hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          <div className="text-center mb-6">
            <p className="text-sm text-neutral-600 mb-1">
              Already have an account?
            </p>
            <Link 
              href="/signin" 
              className="text-base text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <p className="text-xs text-neutral-500 text-center leading-5">
              By continuing, you agree to our{" "}
              <Link href="#" className="underline text-black hover:text-neutral-700">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="#" className="underline text-black hover:text-neutral-700">
                Privacy Policy
              </Link>
              . We'll send you a secure link to access your account.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Central Square
          </Link>
        </div>
      </div>
    </div>
  );
}
