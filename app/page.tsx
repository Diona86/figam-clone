"use client"
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function Page() {
  return (
    <main  className="h-screen w-screen overflow-hidden"> 
      <Navbar />
      <section className="h-[calc(100vh-60px)] w-full flex">
        <LeftSidebar />
        <Live/>
        <RightSidebar />
      </section>
    </main>
    
  );
}