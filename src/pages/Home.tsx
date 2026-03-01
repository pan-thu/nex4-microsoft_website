import { HeroSlider } from '@/components/home/HeroSlider';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Testimonials } from '@/components/home/Testimonials';
import { OurLocations } from '@/components/home/OurLocations';

export function Home() {
  return (
    <div className="pt-[76px]">
      <HeroSlider />
      <WhatWeDo />
      <Testimonials />
      <OurLocations />
    </div>
  );
}
