import { Hero } from '@/components/home/Hero';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { DistrictsSection } from '@/components/home/DistrictsSection';

export default function HomePage() {
  return (
    <main className="page-main page-main--no-header">
      <Hero />
      <FeaturedSection />
      <DistrictsSection />
    </main>
  );
}
