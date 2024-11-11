'use client';

import Header from "@/components/Layout/Header";
import Navbar from "@/components/Layout/Navbar";

export default function Home() {

  return (
    <main className="w-100 h-screen flex items-center justify-center flex-col gap-2">
      <Header />
      <Navbar />
      <div>
        This is the main content
      </div>
    </main>
  );
}
