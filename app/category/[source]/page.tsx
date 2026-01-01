import DramaCard from '@/components/ui/DramaCard';
import { DramaGridSkeleton } from '@/components/ui/Skeleton';
import {
    fetchDramaBoxTrending,
    fetchDramaBoxLatest,
    fetchDramaBoxDubbed,
    fetchNetShortTheaters,
    fetchNetShortForYou,
    fetchMeloloTrending,
    fetchMeloloLatest
} from '@/lib/api';
import { Drama } from '@/lib/types';
import { Suspense } from 'react';
import { Metadata } from 'next';

interface CategoryPageProps {
    params: Promise<{ source: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { source } = await params;
    const titles: Record<string, string> = {
        dramabox: 'DramaBox',
        netshort: 'NetShort',
        melolo: 'Melolo'
    };

    const title = titles[source] || 'Kategori';

    return {
        title: `${title} - Drama China`,
        description: `Nonton drama China dari ${title}. Streaming drama pendek dan serial terbaik di Peystream.`,
    };
}

// Fetch dramas based on source
async function getDramasBySource(source: string): Promise<Drama[]> {
    switch (source) {
        case 'dramabox':
            const [trending, latest, dubbed] = await Promise.all([
                fetchDramaBoxTrending(),
                fetchDramaBoxLatest(),
                fetchDramaBoxDubbed('terpopuler')
            ]);
            // Combine and remove duplicates
            const combined = [...trending, ...latest, ...dubbed];
            const uniqueIds = new Set<string>();
            return combined.filter(drama => {
                if (uniqueIds.has(drama.id)) return false;
                uniqueIds.add(drama.id);
                return true;
            });

        case 'netshort':
            const [theaters, foryou] = await Promise.all([
                fetchNetShortTheaters(),
                fetchNetShortForYou(1)
            ]);
            const netCombined = [...theaters, ...foryou];
            const netUniqueIds = new Set<string>();
            return netCombined.filter(drama => {
                if (netUniqueIds.has(drama.id)) return false;
                netUniqueIds.add(drama.id);
                return true;
            });

        case 'melolo':
            const [meloTrending, meloLatest] = await Promise.all([
                fetchMeloloTrending(),
                fetchMeloloLatest()
            ]);
            const meloCombined = [...meloTrending, ...meloLatest];
            const meloUniqueIds = new Set<string>();
            return meloCombined.filter(drama => {
                if (meloUniqueIds.has(drama.id)) return false;
                meloUniqueIds.add(drama.id);
                return true;
            });

        default:
            return [];
    }
}

// Source info
const sourceInfo: Record<string, { name: string; description: string; color: string; gradient: string }> = {
    dramabox: {
        name: 'DramaBox',
        description: 'Koleksi drama China terlengkap dengan berbagai genre menarik',
        color: 'text-purple-400',
        gradient: 'from-purple-600 to-purple-400'
    },
    netshort: {
        name: 'NetShort',
        description: 'Drama pendek berkualitas tinggi untuk hiburan cepat',
        color: 'text-blue-400',
        gradient: 'from-blue-600 to-blue-400'
    },
    melolo: {
        name: 'Melolo',
        description: 'Serial drama populer dengan alur cerita yang menarik',
        color: 'text-green-400',
        gradient: 'from-green-600 to-green-400'
    }
};

// Drama Grid Component
function DramaGrid({ dramas }: { dramas: Drama[] }) {
    if (dramas.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Drama</h3>
                <p className="text-white/60">Drama dari sumber ini tidak tersedia saat ini.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {dramas.map((drama, index) => (
                <DramaCard key={`${drama.id}-${index}`} drama={drama} priority={index < 12} />
            ))}
        </div>
    );
}

// Loading State
function LoadingState() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DramaGridSkeleton count={18} />
        </div>
    );
}

// Main Category Page
export default async function CategoryPage({ params }: CategoryPageProps) {
    const { source } = await params;
    const info = sourceInfo[source];
    const dramas = await getDramasBySource(source);

    if (!info) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-white/60">Kategori tidak ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="relative py-16 md:py-24 overflow-hidden">
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-10`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className={`inline-block px-4 py-1.5 text-sm font-semibold ${info.color} bg-white/5 rounded-full mb-4`}>
                            Kategori
                        </span>
                        <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${info.gradient} mb-4`}>
                            {info.name}
                        </h1>
                        <p className="text-lg text-white/60">
                            {info.description}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                                </svg>
                                {dramas.length} Drama
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drama Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Suspense fallback={<LoadingState />}>
                    <DramaGrid dramas={dramas} />
                </Suspense>
            </div>
        </div>
    );
}
