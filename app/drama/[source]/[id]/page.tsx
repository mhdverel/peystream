import { Metadata } from 'next';
import {
    fetchDramaBoxDetail,
    fetchDramaBoxEpisodes,
    fetchNetShortEpisodesWithDetail,
    fetchMeloloDetailWithEpisodes
} from '@/lib/api';
import { Episode } from '@/lib/types';
import DramaDetailClient from './DramaDetailClient';

interface DramaPageProps {
    params: Promise<{ source: string; id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DramaPageProps): Promise<Metadata> {
    const { source, id } = await params;

    let title = 'Drama';
    try {
        if (source === 'dramabox') {
            const detail = await fetchDramaBoxDetail(id);
            title = detail?.bookName || detail?.name || 'Drama';
        } else if (source === 'netshort') {
            const data = await fetchNetShortEpisodesWithDetail(id);
            title = data.title || 'Drama NetShort';
        } else if (source === 'melolo') {
            const data = await fetchMeloloDetailWithEpisodes(id);
            title = data.title || 'Drama Melolo';
        }
    } catch (error) {
        console.error('Error fetching metadata:', error);
    }

    return {
        title: `${title} - Nonton Streaming`,
        description: `Nonton ${title} streaming online di Peystream. Kualitas terbaik, tanpa iklan.`,
    };
}

// Fetch drama detail and episodes based on source
async function getDramaData(source: string, id: string) {
    let detail = null;
    let episodes: Episode[] = [];

    try {
        switch (source) {
            case 'dramabox':
                [detail, episodes] = await Promise.all([
                    fetchDramaBoxDetail(id),
                    fetchDramaBoxEpisodes(id)
                ]);
                break;

            case 'netshort':
                // NetShort allepisode endpoint returns drama info along with episodes
                const netshortData = await fetchNetShortEpisodesWithDetail(id);
                episodes = netshortData.episodes;
                detail = {
                    title: netshortData.title || 'Drama NetShort',
                    description: netshortData.description || 'Drama pendek dari NetShort',
                    episodeCount: netshortData.episodeCount || episodes.length,
                    cover: netshortData.cover || ''
                };
                break;

            case 'melolo':
                // Melolo detail returns video_data with series info and video_list
                const meloloData = await fetchMeloloDetailWithEpisodes(id);
                detail = {
                    title: meloloData.title || 'Drama Melolo',
                    description: meloloData.description || 'Tidak ada deskripsi.',
                    episodeCount: meloloData.episodeCount || 0,
                    cover: meloloData.cover || ''
                };
                episodes = meloloData.episodes;
                break;
        }
    } catch (error) {
        console.error('Error fetching drama data:', error);
    }

    return { detail, episodes };
}

// Main Drama Page Component
export default async function DramaPage({ params }: DramaPageProps) {
    const { source, id } = await params;
    const { detail, episodes } = await getDramaData(source, id);

    // If no detail found, show error
    if (!detail) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Drama Tidak Ditemukan</h1>
                    <p className="text-white/60 mb-6">Drama yang Anda cari tidak tersedia atau telah dihapus.</p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
        );
    }

    return (
        <DramaDetailClient
            source={source}
            id={id}
            detail={detail}
            initialEpisodes={episodes}
        />
    );
}
