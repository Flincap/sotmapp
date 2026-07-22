import Navbar from "@/components/global/Navbar";
import Header from "@/components/Header";
import AllSermons from "@/components/AllSermons";
import FeaturedSermons from "@/components/FeaturedSermons";
export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Header />
      <FeaturedSermons />
      <AllSermons />
    </div>
  );
}
