'use client';

import Navbar from "@/components/Layout/Navbar";
import Button from "../components/global/Button";

export default function Home() {
  return (
    <main className="w-100 h-screen flex items-center justify-center flex-col gap-2">
      <Navbar />
      <div>
        This is the main content
      </div>
    </main>
  );
}
