'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from './Hero';

export default function HeroClient() {
  const router = useRouter();

  const onLearnMore = useCallback(() => {
    // 範例行為：導向 /about（根據你的需求改成滾動或開 modal）
    router.push('/about');
  }, [router]);

  return <Hero onLearnMore={onLearnMore} />;
}
