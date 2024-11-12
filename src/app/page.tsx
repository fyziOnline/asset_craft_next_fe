'use client';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

export default function Home() {

  return (
    <main className="w-100 h-screen flex items-center justify-center flex-col gap-2">
      <Header />
      <Navbar />
      <div>
        This is the main content
      </div>
      <Footer/>
    </main>
  );
}
