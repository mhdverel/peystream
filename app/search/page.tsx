import { Suspense } from 'react';
import { Metadata } from 'next';
import DramaCard from '@/components/ui/DramaCard';
import { DramaGridSkeleton } from '@/components/ui/Skeleton';
import { searchAll } from '@/lib/api';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Pencarian: ${q}` : 'Pencarian',
        description: `Hasil pencarian drama untuk "${q || ''}"`,
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';
    const results = query ? await searchAll(query) : [];

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Pencarian
                    </h1>
                    {query && (
                        <p className="text-white/60">
                            Menampilkan hasil untuk &quot;<span className="text-red-400">{query}</span>&quot;
                            {results.length > 0 && ` (${results.length} drama)`}
                        </p>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {!query ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Cari Drama</h3>
                        <p className="text-white/60">Masukkan kata kunci untuk mencari drama</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Tidak Ditemukan</h3>
                        <p className="text-white/60">Tidak ada drama yang cocok dengan &quot;{query}&quot;</p>
                    </div>
                ) : (
                    <Suspense fallback={<DramaGridSkeleton count={12} />}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {results.map((drama, index) => (
                                <DramaCard key={`${drama.id}-${index}`} drama={drama} priority={index < 12} />
                            ))}
                        </div>
                    </Suspense>
                )}
            </div>
        </div>
    );
}
