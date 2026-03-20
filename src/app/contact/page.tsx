"use client";

import type { Metadata } from "next";
import { useState } from "react";

// Note: metadata export doesn't work in client components.
// Move to a separate server wrapper if needed.

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to a form service (Formspree, Web3Forms, etc.)
    setStatus("sent");
  }

  return (
    <div className="max-w-lg mx-auto px-8 py-16">
      <h1 className="text-2xl font-medium mb-10">Contact</h1>

      {status === "sent" ? (
        <p className="text-gray-600">Thank you! I&apos;ll be in touch.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-600" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label
              className="block text-sm mb-2 text-gray-600"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label
              className="block text-sm mb-2 text-gray-600"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[#111] text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
