import Link from 'next/link';
import Image from 'next/image';
import { Drama } from '@/lib/types';

interface DramaCardProps {
    drama: Drama;
    priority?: boolean;
}

// DramaCard component dengan hover effects dan badges
export default function DramaCard({ drama, priority = false }: DramaCardProps) {
    const getSourceColor = (source: string) => {
        switch (source) {
            case 'dramabox':
                return 'from-purple-500 to-purple-700';
            case 'netshort':
                return 'from-blue-500 to-blue-700';
            case 'melolo':
                return 'from-green-500 to-green-700';
            default:
                return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <Link
            href={`/drama/${drama.source}/${drama.id}`}
            className="group relative block"
        >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/20 group-hover:scale-[1.02]">
                {/* Thumbnail */}
                {drama.cover ? (
                    <Image
                        src={drama.cover}
                        alt={drama.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={priority}
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Status Badges - Top Left, stacked vertically */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 max-w-[60%]">
                    {drama.isTrending && (
                        <span className="inline-block w-fit px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-gradient-to-r from-red-500 to-orange-500 text-white rounded shadow-lg">
                            🔥 Trending
                        </span>
                    )}
                    {drama.isNew && (
                        <span className="inline-block w-fit px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded shadow-lg">
                            ✨ Baru
                        </span>
                    )}
                    {drama.isDubbed && (
                        <span className="inline-block w-fit px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded shadow-lg">
                            🎙️ Dub Indo
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Source Badge */}
                    <span className={`inline-block mb-1.5 px-1.5 py-0.5 text-[8px] font-bold uppercase bg-gradient-to-r ${getSourceColor(drama.source)} text-white rounded shadow-lg`}>
                        {drama.source}
                    </span>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">
                        {drama.title}
                    </h3>
                    {drama.episodeCount && drama.episodeCount > 0 && (
                        <p className="text-white/60 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
                            </svg>
                            {drama.episodeCount} Episode
                        </p>
                    )}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-red-500/90 flex items-center justify-center shadow-lg shadow-red-500/50 transform scale-75 group-hover:scale-100 transition-transform">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
