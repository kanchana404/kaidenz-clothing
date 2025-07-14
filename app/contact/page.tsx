"use client";
import React, { useState } from "react";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="max-w-xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-6 text-primary">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">We&apos;d love to hear from you! Fill out the form below and our team will get back to you soon.</p>
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="message">Message</Label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder="Type your message..." className="rounded-lg border border-border px-3 py-2 min-h-[100px] resize-none" />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground font-bold rounded-lg py-3 text-lg mt-2">Send Message</Button>
          {submitted && <div className="text-green-600 font-semibold mt-2">Thank you! Your message has been sent.</div>}
        </form>
        <div className="mt-10 text-sm text-muted-foreground">
          Or email us directly at <a href="mailto:info@kaidenz.com" className="text-primary underline">info@kaidenz.com</a>
        </div>
      </div>
      <Footer />
    </div>
  );
} 