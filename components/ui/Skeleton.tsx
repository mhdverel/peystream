// Skeleton loading components

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
    );
}

export function DramaCardSkeleton() {
    return (
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a]">
            <Skeleton className="absolute inset-0 rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function DramaGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <DramaCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="relative h-[70vh] min-h-[500px] bg-[#0a0a0a]">
            <Skeleton className="absolute inset-0" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-4">
                <Skeleton className="h-10 w-2/3 md:w-1/3" />
                <Skeleton className="h-4 w-full md:w-1/2" />
                <Skeleton className="h-4 w-3/4 md:w-1/3" />
                <div className="flex gap-4 pt-4">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                </div>
            </div>
        </div>
    );
}

export function VideoPlayerSkeleton() {
    return (
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse" />
            </div>
        </div>
    );
}

export function EpisodeListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
