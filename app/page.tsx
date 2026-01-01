import Image from 'next/image';
import Link from 'next/link';
import DramaCard from '@/components/ui/DramaCard';
import HorizontalScroll from '@/components/ui/HorizontalScroll';
import { DramaGridSkeleton } from '@/components/ui/Skeleton';
import {
  fetchDramaBoxTrending,
  fetchDramaBoxLatest,
  fetchDramaBoxDubbed,
  fetchNetShortTheaters
} from '@/lib/api';
import { Drama } from '@/lib/types';
import { Suspense } from 'react';

// Hero Section dengan featured drama
function HeroSection({ drama }: { drama: Drama | null }) {
  if (!drama) {
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-[#1a0a0a] via-[#0a0a0a] to-[#0a0a1a] flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Selamat Datang di<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Peystream
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8">
              Nikmati ribuan drama China terbaik dengan kualitas tinggi.
              Tersedia drama pendek, serial, dan sulih suara Bahasa Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/dramabox"
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/30"
              >
                Jelajahi Sekarang
              </Link>
              <Link
                href="#trending"
                className="px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
              >
                Lihat Trending
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={drama.cover}
          alt={drama.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full">
              🔥 Featured
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-full backdrop-blur-sm">
              {drama.source.toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {drama.title}
          </h1>
          {drama.description && (
            <p className="text-base md:text-lg text-white/70 mb-6 line-clamp-3">
              {drama.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/drama/${drama.source}/${drama.id}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Tonton Sekarang
            </Link>
            <Link
              href={`/drama/${drama.source}/${drama.id}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Info Lainnya
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Drama Section Component
interface DramaSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  dramas: Drama[];
  viewAllHref?: string;
  isHorizontalScroll?: boolean;
}

function DramaSection({ id, title, subtitle, dramas, viewAllHref, isHorizontalScroll = false }: DramaSectionProps) {
  if (dramas.length === 0) return null;

  return (
    <section id={id} className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-white/60 mt-1">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1"
            >
              Lihat Semua
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Drama Grid/Scroll */}
        {isHorizontalScroll ? (
          <HorizontalScroll>
            {dramas.slice(0, 15).map((drama, index) => (
              <div key={`${drama.id}-${index}`} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                <DramaCard drama={drama} priority={index < 5} />
              </div>
            ))}
          </HorizontalScroll>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {dramas.slice(0, 10).map((drama, index) => (
              <DramaCard key={`${drama.id}-${index}`} drama={drama} priority={index < 5} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Loading Component
function SectionLoading() {
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-white/10 rounded mb-6 animate-pulse" />
        <DramaGridSkeleton count={10} />
      </div>
    </div>
  );
}

// Main Home Page Component
export default async function HomePage() {
  // Fetch all data in parallel
  const [trendingDramas, latestDramas, dubbedDramas, netshortDramas] = await Promise.all([
    fetchDramaBoxTrending(),
    fetchDramaBoxLatest(),
    fetchDramaBoxDubbed('terpopuler'),
    fetchNetShortTheaters()
  ]);

  // Get featured drama for hero
  const featuredDrama = trendingDramas[0] || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <HeroSection drama={featuredDrama} />

      {/* Trending Section */}
      <Suspense fallback={<SectionLoading />}>
        <DramaSection
          id="trending"
          title="🔥 Sedang Trending"
          subtitle="Drama paling populer minggu ini"
          dramas={trendingDramas}
          viewAllHref="/trending"
          isHorizontalScroll
        />
      </Suspense>

      {/* Latest Section */}
      <Suspense fallback={<SectionLoading />}>
        <DramaSection
          id="latest"
          title="✨ Terbaru"
          subtitle="Update drama terbaru"
          dramas={latestDramas}
          viewAllHref="/terbaru"
        />
      </Suspense>

      {/* Dubbed Section */}
      <Suspense fallback={<SectionLoading />}>
        <DramaSection
          id="dubbed"
          title="🎙️ Sulih Suara Indonesia"
          subtitle="Drama dengan dubbing Bahasa Indonesia"
          dramas={dubbedDramas}
          viewAllHref="/dubbed"
          isHorizontalScroll
        />
      </Suspense>

      {/* NetShort Section */}
      <Suspense fallback={<SectionLoading />}>
        <DramaSection
          title="📺 NetShort"
          subtitle="Drama theater pilihan"
          dramas={netshortDramas}
          viewAllHref="/category/netshort"
        />
      </Suspense>
    </div>
  );
}
