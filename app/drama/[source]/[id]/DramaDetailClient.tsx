'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { VideoPlayerSkeleton, EpisodeListSkeleton } from '@/components/ui/Skeleton';
import { Episode } from '@/lib/types';

interface DramaDetailClientProps {
    source: string;
    id: string;
    detail: any;
    initialEpisodes: Episode[];
}

export default function DramaDetailClient({
    source,
    id,
    detail,
    initialEpisodes
}: DramaDetailClientProps) {
    const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const playerRef = useRef<HTMLDivElement>(null);

    // Set first episode on mount
    useEffect(() => {
        if (episodes.length > 0 && !currentEpisode) {
            handleSelectEpisode(episodes[0], 0);
        }
    }, [episodes]);

    // Get video URL for episode
    const getVideoUrl = async (episode: Episode): Promise<string | null> => {
        console.log('Getting video URL for episode:', episode);

        // If episode already has videoUrl, use it directly
        if (episode.videoUrl && episode.videoUrl.length > 0) {
            console.log('Using existing videoUrl:', episode.videoUrl);
            return episode.videoUrl;
        }

        const API_BASE = process.env.NEXT_PUBLIC_SANSEKAI_API_BASE_URL || 'https://api.sansekai.my.id/api';

        // For Melolo, we need to fetch the stream URL
        if (source === 'melolo') {
            try {
                const response = await fetch(`${API_BASE}/melolo/stream?videoId=${episode.id}`);
                const data = await response.json();
                console.log('Melolo stream response:', data);
                // Melolo stream returns main_url or backup_url in data object
                return data.data?.main_url || data.data?.backup_url || data.data?.videoUrl || data.data?.url || null;
            } catch (error) {
                console.error('Failed to fetch Melolo stream:', error);
                return null;
            }
        }

        // For NetShort episodes, the video URL might be in the episode data
        // If not available, there's no separate endpoint, so return null
        console.log('No video URL available for this episode');
        return null;
    };

    // Handle episode selection
    const handleSelectEpisode = async (episode: Episode, index: number) => {
        setIsLoadingVideo(true);
        setCurrentEpisode(episode);
        setCurrentEpisodeIndex(index);

        // Scroll to player
        if (playerRef.current) {
            playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Get video URL
        const url = await getVideoUrl(episode);
        setVideoUrl(url);
        setIsLoadingVideo(false);
    };

    // Handle episode change from player
    const handleEpisodeChange = (episode: Episode) => {
        const index = episodes.findIndex(ep => ep.id === episode.id);
        if (index !== -1) {
            handleSelectEpisode(episode, index);
        }
    };

    // Get drama info - handle different API response structures
    const title = detail?.bookName || detail?.shortPlayName || detail?.name || detail?.title || 'Drama';
    const cover = detail?.cover || detail?.shortPlayCover || detail?.coverUrl || '';
    const description = detail?.introduction || detail?.shotIntroduce || detail?.description || detail?.desc || 'Tidak ada deskripsi.';
    const totalEpisodes = detail?.chapterCount || detail?.totalChapter || detail?.totalEpisode || detail?.episodeCount || episodes.length;

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Background */}
            <div className="relative h-[40vh] min-h-[300px]">
                {cover && (
                    <>
                        <Image
                            src={cover}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative -mt-32 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div ref={playerRef} className="pt-4">
                            {isLoadingVideo ? (
                                <VideoPlayerSkeleton />
                            ) : videoUrl ? (
                                <VideoPlayer
                                    videoUrl={videoUrl}
                                    episode={currentEpisode!}
                                    episodes={episodes}
                                    currentEpisodeIndex={currentEpisodeIndex}
                                    onEpisodeChange={handleEpisodeChange}
                                />
                            ) : (
                                <div className="aspect-video bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60">Pilih episode untuk mulai menonton</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drama Info */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <div className="flex items-start gap-2 mb-4">
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${source === 'dramabox' ? 'bg-purple-500/20 text-purple-400' :
                                    source === 'netshort' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-green-500/20 text-green-400'
                                    }`}>
                                    {source}
                                </span>
                                {totalEpisodes > 0 && (
                                    <span className="px-3 py-1 text-xs font-medium bg-white/10 text-white/70 rounded-full">
                                        {totalEpisodes} Episode
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h1>
                            <p className="text-white/70 leading-relaxed">{description}</p>
                        </div>
                    </div>

                    {/* Sidebar - Episode List */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1a1a1a] rounded-xl p-4 sticky top-24">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                                </svg>
                                Daftar Episode
                            </h3>

                            {episodes.length === 0 ? (
                                <EpisodeListSkeleton count={6} />
                            ) : (
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                    {episodes.map((episode, index) => (
                                        <button
                                            key={episode.id}
                                            onClick={() => handleSelectEpisode(episode, index)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${currentEpisodeIndex === index
                                                ? 'bg-red-500/20 border border-red-500/30'
                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${currentEpisodeIndex === index
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/10 text-white/70'
                                                }`}>
                                                {episode.episodeNo}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${currentEpisodeIndex === index ? 'text-red-400' : 'text-white'
                                                    }`}>
                                                    {episode.title}
                                                </p>
                                                {episode.duration && (
                                                    <p className="text-xs text-white/50">{episode.duration}</p>
                                                )}
                                            </div>
                                            {currentEpisodeIndex === index && (
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
