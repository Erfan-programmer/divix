import BestSellers from "../components/Modules/Home/BestSellers";
import HeroSection from "../components/Modules/Home/HeroSection";
import ProductLists from "../components/Modules/Home/ProductLists";
import UserReview from "../components/Modules/Home/UserReview";
import HomeSections from "../components/Modules/HomeSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductLists />
      <BestSellers />
      <HomeSections />
      <UserReview />
    </div>
  );
}
