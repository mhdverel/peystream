'use client';

import DramaCard from '@/components/ui/DramaCard';
import { DramaGridSkeleton } from '@/components/ui/Skeleton';
import { fetchDramaBoxDubbed, fetchNetShortTheaters, fetchNetShortForYou, fetchMeloloTrending, fetchMeloloLatest } from '@/lib/api';
import { Drama } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function DubbedPage() {
    const [dramas, setDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'terpopuler' | 'terbaru'>('terpopuler');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch from all sources
                const [
                    dramaBoxPopular,
                    dramaBoxLatest,
                    netShortTheaters,
                    netShortForYou,
                    meloloTrending,
                    meloloLatest
                ] = await Promise.all([
                    fetchDramaBoxDubbed('terpopuler'),
                    fetchDramaBoxDubbed('terbaru'),
                    fetchNetShortTheaters(),
                    fetchNetShortForYou(1),
                    fetchMeloloTrending(),
                    fetchMeloloLatest()
                ]);

                // Combine all and filter only dubbed content (those with isDubbed=true)
                const allDramas = [
                    ...dramaBoxPopular,
                    ...dramaBoxLatest,
                    ...netShortTheaters,
                    ...netShortForYou,
                    ...meloloTrending,
                    ...meloloLatest
                ].filter(drama => drama.isDubbed);

                // Sort based on active tab (for DramaBox, terbaru comes first if selected)
                const sorted = activeTab === 'terbaru'
                    ? [...allDramas].reverse()
                    : allDramas;

                // Remove duplicates by id
                const uniqueIds = new Set<string>();
                const unique = sorted.filter(drama => {
                    const key = `${drama.source}-${drama.id}`;
                    if (uniqueIds.has(key)) return false;
                    uniqueIds.add(key);
                    return true;
                });

                setDramas(unique);
            } catch (error) {
                console.error('Error fetching dubbed:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="relative py-16 md:py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-yellow-400 opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-1.5 text-sm font-semibold text-amber-400 bg-white/5 rounded-full mb-4">
                            🎙️ Dubbed
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 mb-4">
                            Sulih Suara Indonesia
                        </h1>
                        <p className="text-lg text-white/60">
                            Drama China dengan dubbing Bahasa Indonesia untuk pengalaman menonton yang lebih mudah
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                                </svg>
                                {loading ? '...' : dramas.length} Drama
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('terpopuler')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'terpopuler'
                            ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Terpopuler
                    </button>
                    <button
                        onClick={() => setActiveTab('terbaru')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'terbaru'
                            ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Terbaru
                    </button>
                </div>
            </div>

            {/* Drama Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (
                    <DramaGridSkeleton count={18} />
                ) : dramas.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Drama</h3>
                        <p className="text-white/60">Drama sulih suara tidak tersedia saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {dramas.map((drama, index) => (
                            <DramaCard key={`${drama.id}-${index}`} drama={drama} priority={index < 12} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
