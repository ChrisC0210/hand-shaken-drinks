'use client';

interface HeroProps {
  onLearnMore: () => void;
}

export function Hero({ onLearnMore }: HeroProps) {
  return (
    <section className="card relative h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl text-gray-900 mb-6">
          開始查詢您的理想飲品
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
          探索我們多樣化的手搖飲品選擇，找到最適合您的口味與風格。
        </p>
        <button
          onClick={onLearnMore}
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 transition-colors"
        >
          了解更多
          {/* <ChevronDown size={20} /> */}
        </button>
      </div>
    </section>
  );
}
