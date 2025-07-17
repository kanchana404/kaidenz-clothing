"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router = useRouter();

  function handleInputChange(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    } else if (!value && index > 0) {
      // If deleting, focus previous
      inputRefs[index - 1].current?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '');
    if (paste.length === 6) {
      const pasteArr = paste.split("").slice(0, 6);
      setCode(pasteArr);
      // Focus the last input
      inputRefs[5].current?.focus();
      e.preventDefault();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const userDataRaw = sessionStorage.getItem('signupUser');
    if (!userDataRaw) {
      toast.error("No user data found. Please sign up again.");
      setLoading(false);
      return;
    }
    const userData = JSON.parse(userDataRaw);
    const user_id = userData.user_id;
    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, code: codeStr })
      });
      const data = await res.json();
      if (res.ok && data.status) {
        toast.success("Email verified successfully!");
        router.push("/");
      } else {
        toast.error(data.message || "Verification failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Top bar with logo and home button */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/bg_empty_logo.png" alt="Shop Logo" width={120} height={120} priority className="rounded" />
        </Link>
      </div>
      {/* Left: Form and Headings */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8 gap-6 min-h-screen">
        <div className="w-full max-w-sm mt-20 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between gap-2 mb-6">
                  {code.map((digit, i) => (
                    <Input
                      key={i}
                      ref={inputRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-mono"
                      required
                      value={digit}
                      onChange={e => handleInputChange(i, e.target.value)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify Email"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right: Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-muted">
        <Image src="/auth.png" alt="auth" width={700} height={700} className="object-contain" />
      </div>
      {/* Mobile Image */}
      <div className="hidden w-full justify-center mb-4">
        <Image src="/auth.png" alt="auth" width={200} height={200} className="object-contain" />
      </div>
    </div>
  )
} 