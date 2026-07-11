import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Flow from "@/components/Flow";
import Ledger from "@/components/Ledger";
import Architecture from "@/components/Architecture";
import Stack from "@/components/Stack";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Flow />
      <Ledger />
      <Architecture />
      <Stack />
      <Cta />
      <Footer />
    </main>
  );
}
