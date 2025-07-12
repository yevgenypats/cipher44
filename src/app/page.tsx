"use client";

import { Button } from "@/components/ui/button";
import { FiArrowUpRight } from "react-icons/fi";
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string>("");

  // Generate UUID on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('cipher44_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem('cipher44_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleSubmit = async () => {
    const prompt = textAreaRef.current?.value;
    if (!prompt?.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          userId,
          type: 'prompt'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          type: 'waitlist'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setIsRegistered(true);
    } catch (error) {
      console.error("Waitlist signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#181818] px-4 py-0 relative overflow-hidden">
      {/* Blue radial glow at the top center */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,180,255,0.18) 0%, rgba(10,10,10,0.0) 70%)"
        }}
      />
      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center gap-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-tight text-white leading-tight mb-0">
          What can I help you build?
        </h1>
        <p className="text-lg text-white/60 text-center max-w-2xl mb-6">
          Build and deploy stunning data apps with python for data and Next.js for frontend.
        </p>
        {/* Prompt Box */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-4xl bg-[#181818] border border-white/10 shadow-2xl rounded-3xl px-8 pt-6 pb-14" style={{ minHeight: 128 }}>
            <div className="pr-4">
              <textarea
                ref={textAreaRef}
                placeholder="Ask cipher44 to build..."
                rows={2}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none border-none text-white text-base font-normal placeholder:text-white/40 px-0 py-2 resize-none min-h-[128px] max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40 transition-colors"
                style={{ minWidth: 0 }}
              />
            </div>
            <Button 
              size="icon" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-200 rounded-full shadow-md w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowUpRight size={24} />
            </Button>
          </div>
        </div>

        {/* Database Integrations */}
        <div className="mt-8 text-center">
          <p className="text-white/60 mb-4">Works great with</p>
          <div className="flex items-center justify-center gap-8">
            {/* Snowflake */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#29B5E8]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/snowflake.svg" 
                  alt="Snowflake" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">Snowflake</span>
            </div>

            {/* Databricks */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#FF3621]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/databricks.svg" 
                  alt="Databricks" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">Databricks</span>
            </div>

            {/* Redshift */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#FF3621]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/redshift.svg" 
                  alt="Redshift" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">Redshift</span>
            </div>

            {/* ClickHouse */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#FFCC01]/20 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/clickhouse.svg" 
                  alt="ClickHouse" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">ClickHouse</span>
            </div>

            {/* PostgreSQL */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#336791]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/postgresql.svg" 
                  alt="PostgreSQL" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">PostgreSQL</span>
            </div>

            {/* BigQuery */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#4285F4]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/bigquery.svg" 
                  alt="BigQuery" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">BigQuery</span>
            </div>

            {/* MongoDB */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#00ED64]/10 rounded-lg flex items-center justify-center">
                <img 
                  src="/assets/integrations/mongodb.svg" 
                  alt="MongoDB" 
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xs text-white/40">MongoDB</span>
            </div>
          </div>
        </div>
      </main>

      {/* Waitlist Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRegistered ? "Thank You!" : "Join the Waitlist"}</DialogTitle>
            <DialogDescription>
              {isRegistered 
                ? "Cipher44 is currently in closed beta - Thanks for registering to the waitlist, we will let you know once it is ready for you!"
                : "Join the waitlist and we'll notify you when Cipher44 is ready."}
            </DialogDescription>
          </DialogHeader>
          {!isRegistered && (
            <form onSubmit={handleWaitlistSignup} className="flex flex-col gap-3 mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Join Waitlist
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
