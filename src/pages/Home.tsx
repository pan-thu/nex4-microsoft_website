import { HeroSlider } from '@/components/home/HeroSlider';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Testimonials } from '@/components/home/Testimonials';
import { OurLocations } from '@/components/home/OurLocations';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';

export function Home() {
  return (
    <div className="pt-[76px] relative">
      <BackgroundBlobs prominent />

      <div className="relative" style={{ zIndex: 1 }}>
        <HeroSlider />
        <WhatWeDo />
        <Testimonials />
        <OurLocations />
      </div>
    </div>
  );
}
