// Type definitions for Peystream drama streaming

// ====================================
// DramaBox Types
// ====================================
export interface DramaBoxItem {
    bookId: string;
    bookName: string;
    cover: string;
    description?: string;
    totalChapter?: number;
    updateChapter?: number;
    isDubIndo?: boolean;
    tags?: string[];
}

export interface DramaBoxDetail {
    bookId: string;
    bookName: string;
    cover: string;
    description: string;
    totalChapter: number;
    author?: string;
    tags?: string[];
}

export interface DramaBoxEpisode {
    chapterId: string;
    chapterName: string;
    chapterNo: number;
    videoUrl?: string;
    duration?: string;
}

// ====================================
// NetShort Types
// ====================================
export interface NetShortItem {
    shortPlayId: string;
    title: string;
    cover: string;
    description?: string;
    episodeCount?: number;
    tags?: string[];
}

export interface NetShortEpisode {
    episodeId: string;
    episodeName: string;
    episodeNo: number;
    videoUrl?: string;
}

// ====================================
// Melolo Types
// ====================================
export interface MeloloItem {
    bookId: string;
    title: string;
    cover: string;
    description?: string;
    episodeCount?: number;
    tags?: string[];
}

export interface MeloloDetail {
    bookId: string;
    title: string;
    cover: string;
    description: string;
    episodes: MeloloEpisode[];
}

export interface MeloloEpisode {
    vid: string;
    title: string;
    episodeNo: number;
    videoUrl?: string;
}

// ====================================
// Generic Types
// ====================================
export interface Drama {
    id: string;
    title: string;
    cover: string;
    description?: string;
    episodeCount?: number;
    source: 'dramabox' | 'netshort' | 'melolo';
    isDubbed?: boolean;
    isTrending?: boolean;
    isNew?: boolean;
}

export interface Episode {
    id: string;
    title: string;
    episodeNo: number;
    videoUrl?: string;
    duration?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
