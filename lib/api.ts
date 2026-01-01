// Sansekai API Integration Layer
// Provides reusable fetch functions for DramaBox, NetShort, and Melolo

import { Drama, Episode, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_SANSEKAI_API_BASE_URL || 'https://api.sansekai.my.id/api';

// ====================================
// Helper Functions
// ====================================

// Convert Melolo .heic URLs to supported format using wsrv.nl image proxy
function convertMeloloImageUrl(url: string): string {
    if (!url) return '';
    // Use wsrv.nl image proxy to convert heic to webp for browser compatibility
    if (url.includes('.heic')) {
        // wsrv.nl is a free image proxy that can convert formats
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp&w=300&h=450`;
    }
    return url;
}

async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.data || data };
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Normalize drama data from different sources to unified format
function normalizeDramaBox(item: any, options?: { isTrending?: boolean }): Drama {
    const title = item.bookName || item.name || item.title || '';
    // Check if title contains "(Sulih suara)" or "(Sulih Suara)" for dubbed badge
    const isDubbed = title.toLowerCase().includes('(sulih suara)');

    return {
        id: item.bookId || item.id,
        title: title,
        // DramaBox uses coverWap for thumbnails
        cover: item.coverWap || item.cover || item.coverUrl || '',
        description: item.introduction || item.description || item.desc || '',
        episodeCount: item.chapterCount || item.totalChapter || 0,
        source: 'dramabox',
        isDubbed: isDubbed,
        isTrending: options?.isTrending || false,
        isNew: false
    };
}

function normalizeNetShort(item: any): Drama {
    const title = item.shortPlayName || item.title || item.name || '';
    // Check if title contains "(Sulih suara)" for dubbed badge
    const isDubbed = title.toLowerCase().includes('(sulih suara)');

    return {
        id: item.shortPlayId || item.id,
        title: title,
        // NetShort uses shortPlayCover or groupShortPlayCover
        cover: item.shortPlayCover || item.groupShortPlayCover || item.cover || item.coverUrl || '',
        description: item.description || '',
        // totalEpisode is not available in theaters, will be fetched from detail/episodes
        episodeCount: item.totalEpisode || item.episodeCount || item.totalReserveNum || 0,
        source: 'netshort',
        isDubbed: isDubbed,
        isTrending: item.script === 3 || false, // script 3 = Popular/Trending
        isNew: item.isNewLabel || false
    };
}

function normalizeMelolo(item: any, options?: { isTrending?: boolean }): Drama {
    // Get the raw cover URL
    const rawCover = item.thumb_url || item.cover || item.coverUrl || '';
    const title = item.book_name || item.title || item.name || '';
    // Check if title contains "(Sulih suara)" for dubbed badge
    const isDubbed = title.toLowerCase().includes('(sulih suara)');

    return {
        id: item.book_id || item.bookId || item.id,
        title: title,
        // Melolo cover is in thumb_url field, convert heic to jpeg for browser compatibility
        cover: convertMeloloImageUrl(rawCover),
        description: item.abstract || item.description || '',
        // Melolo uses serial_count for episode count
        episodeCount: item.serial_count || item.episode_count || item.episodeCount || 0,
        source: 'melolo',
        isDubbed: isDubbed,
        isTrending: options?.isTrending || item.is_hot || false,
        isNew: item.is_new_book || false
    };
}

// ====================================
// DramaBox API Functions
// ====================================

export async function fetchDramaBoxTrending(): Promise<Drama[]> {
    const result = await fetchApi<any[]>('/dramabox/trending');
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.slice(0, 20).map(item => normalizeDramaBox(item, { isTrending: true }));
}

export async function fetchDramaBoxLatest(): Promise<Drama[]> {
    const result = await fetchApi<any[]>('/dramabox/latest');
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.slice(0, 20).map(item => ({ ...normalizeDramaBox(item), isNew: true }));
}

export async function fetchDramaBoxDubbed(classify: 'terpopuler' | 'terbaru' = 'terpopuler'): Promise<Drama[]> {
    const result = await fetchApi<any[]>(`/dramabox/dubindo?classify=${classify}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.slice(0, 20).map(item => normalizeDramaBox(item));
}

export async function fetchDramaBoxForYou(): Promise<Drama[]> {
    const result = await fetchApi<any[]>('/dramabox/foryou');
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.slice(0, 20).map(item => normalizeDramaBox(item));
}

export async function fetchDramaBoxDetail(bookId: string): Promise<any | null> {
    const result = await fetchApi<any>(`/dramabox/detail?bookId=${bookId}`);
    if (!result.success || !result.data) return null;
    // API returns {data: {book: {...}}} - extract the book object
    const data = result.data;
    return data.book || data;
}

export async function fetchDramaBoxEpisodes(bookId: string): Promise<Episode[]> {
    const result = await fetchApi<any[]>(`/dramabox/allepisode?bookId=${bookId}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.map((item, index) => {
        // Extract video URL from cdnList.videoPathList
        let videoUrl = '';
        if (item.cdnList && item.cdnList.length > 0) {
            const cdn = item.cdnList.find((c: any) => c.isDefault === 1) || item.cdnList[0];
            if (cdn.videoPathList && cdn.videoPathList.length > 0) {
                // Try to get 720p or default quality video
                const video = cdn.videoPathList.find((v: any) => v.isDefault === 1)
                    || cdn.videoPathList.find((v: any) => v.quality === 720)
                    || cdn.videoPathList.find((v: any) => v.quality === 540)
                    || cdn.videoPathList[0];
                videoUrl = video?.videoPath || '';
            }
        }

        return {
            id: item.chapterId || item.id || `${index}`,
            title: item.chapterName || item.name || `Episode ${index + 1}`,
            episodeNo: item.chapterIndex !== undefined ? item.chapterIndex + 1 : (item.chapterNo || index + 1),
            videoUrl: videoUrl || item.videoUrl || item.url || item.video || '',
            duration: item.duration || ''
        };
    });
}

export async function searchDramaBox(query: string): Promise<Drama[]> {
    const result = await fetchApi<any[]>(`/dramabox/search?query=${encodeURIComponent(query)}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.map(item => normalizeDramaBox(item));
}

// ====================================
// NetShort API Functions
// ====================================

export async function fetchNetShortTheaters(): Promise<Drama[]> {
    const result = await fetchApi<any>('/netshort/theaters');
    if (!result.success || !result.data) return [];

    // NetShort theaters returns array with contentInfos nested inside each group
    const data = result.data;
    let allDramas: Drama[] = [];

    if (Array.isArray(data)) {
        // Extract all dramas from contentInfos in each group
        for (const group of data) {
            if (group.contentInfos && Array.isArray(group.contentInfos)) {
                const dramas = group.contentInfos.map((item: any) => normalizeNetShort(item));
                allDramas = [...allDramas, ...dramas];
            }
        }
    }

    return allDramas.slice(0, 30);
}

export async function fetchNetShortForYou(page: number = 1): Promise<Drama[]> {
    const result = await fetchApi<any[]>(`/netshort/foryou?page=${page}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.map(item => normalizeNetShort(item));
}

export async function fetchNetShortEpisodes(shortPlayId: string): Promise<Episode[]> {
    const result = await fetchApi<any>(`/netshort/allepisode?shortPlayId=${shortPlayId}`);
    if (!result.success || !result.data) return [];

    // NetShort returns data with shortPlayEpisodeInfos array
    const data = result.data;
    let items: any[] = [];

    if (data.shortPlayEpisodeInfos && Array.isArray(data.shortPlayEpisodeInfos)) {
        items = data.shortPlayEpisodeInfos;
    } else if (Array.isArray(data)) {
        items = data;
    }

    return items.map((item, index) => ({
        id: item.episodeId || item.id || `${index}`,
        title: item.episodeName || `Episode ${item.episodeNo || index + 1}`,
        episodeNo: item.episodeNo || index + 1,
        videoUrl: item.playVoucher || item.videoUrl || item.url || '',
        duration: item.duration || ''
    }));
}

// Fetch NetShort episodes along with drama details from allepisode endpoint
export async function fetchNetShortEpisodesWithDetail(shortPlayId: string): Promise<{
    title: string;
    description: string;
    cover: string;
    episodeCount: number;
    episodes: Episode[];
}> {
    const result = await fetchApi<any>(`/netshort/allepisode?shortPlayId=${shortPlayId}`);
    if (!result.success || !result.data) {
        return { title: '', description: '', cover: '', episodeCount: 0, episodes: [] };
    }

    const data = result.data;

    // Extract drama info from response
    const title = data.shortPlayName || '';
    const description = data.shotIntroduce || '';
    const cover = data.shortPlayCover || '';
    const episodeCount = data.totalEpisode || 0;

    // Extract episodes
    let items: any[] = [];
    if (data.shortPlayEpisodeInfos && Array.isArray(data.shortPlayEpisodeInfos)) {
        items = data.shortPlayEpisodeInfos;
    } else if (Array.isArray(data)) {
        items = data;
    }

    const episodes = items.map((item, index) => ({
        id: item.episodeId || item.id || `${index}`,
        title: item.episodeName || `Episode ${item.episodeNo || index + 1}`,
        episodeNo: item.episodeNo || index + 1,
        videoUrl: item.playVoucher || item.videoUrl || item.url || '',
        duration: item.duration || ''
    }));

    return { title, description, cover, episodeCount, episodes };
}

export async function searchNetShort(query: string): Promise<Drama[]> {
    const result = await fetchApi<any[]>(`/netshort/search?query=${encodeURIComponent(query)}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.map(item => normalizeNetShort(item));
}

// ====================================
// Melolo API Functions
// ====================================

export async function fetchMeloloTrending(): Promise<Drama[]> {
    const result = await fetchApi<any>('/melolo/trending');
    if (!result.success || !result.data) return [];

    // Melolo returns { books: [...] } structure
    const data = result.data;
    let items: any[] = [];

    if (data.books && Array.isArray(data.books)) {
        items = data.books;
    } else if (Array.isArray(data)) {
        items = data;
    }

    return items.slice(0, 20).map(item => normalizeMelolo(item, { isTrending: true }));
}

export async function fetchMeloloLatest(): Promise<Drama[]> {
    const result = await fetchApi<any>('/melolo/latest');
    if (!result.success || !result.data) return [];

    // Melolo returns { books: [...] } structure
    const data = result.data;
    let items: any[] = [];

    if (data.books && Array.isArray(data.books)) {
        items = data.books;
    } else if (Array.isArray(data)) {
        items = data;
    }

    return items.slice(0, 20).map(item => ({ ...normalizeMelolo(item), isNew: true }));
}

export async function fetchMeloloDetail(bookId: string): Promise<any | null> {
    const result = await fetchApi<any>(`/melolo/detail?bookId=${bookId}`);
    if (!result.success || !result.data) return null;
    return result.data;
}

// Fetch Melolo detail with episodes extracted from video_data structure
export async function fetchMeloloDetailWithEpisodes(bookId: string): Promise<{
    title: string;
    description: string;
    cover: string;
    episodeCount: number;
    episodes: Episode[];
}> {
    const result = await fetchApi<any>(`/melolo/detail?bookId=${bookId}`);
    if (!result.success || !result.data) {
        return { title: '', description: '', cover: '', episodeCount: 0, episodes: [] };
    }

    // Melolo returns { data: { video_data: { ... } } }
    const videoData = result.data.video_data || result.data;

    // Extract drama info
    const title = videoData.series_title || '';
    const description = videoData.series_intro || '';
    const cover = convertMeloloImageUrl(videoData.series_cover || '');
    const episodeCount = videoData.episode_cnt || 0;

    // Extract episodes from video_list and sort by vid_index
    const videoList = videoData.video_list || [];
    const episodes = videoList
        .map((item: any, index: number) => ({
            id: item.vid || item.id || `${index}`,
            title: item.title || `Episode ${item.vid_index || index + 1}`,
            episodeNo: item.vid_index || index + 1,
            videoUrl: '', // Melolo requires separate stream call with vid
            duration: item.duration || ''
        }))
        .sort((a: Episode, b: Episode) => a.episodeNo - b.episodeNo);

    return { title, description, cover, episodeCount, episodes };
}

export async function fetchMeloloStream(videoId: string): Promise<string | null> {
    const result = await fetchApi<any>(`/melolo/stream?videoId=${videoId}`);
    if (!result.success || !result.data) return null;
    return result.data.videoUrl || result.data.url || result.data;
}

export async function searchMelolo(query: string): Promise<Drama[]> {
    const result = await fetchApi<any[]>(`/melolo/search?query=${encodeURIComponent(query)}`);
    if (!result.success || !result.data) return [];

    const items = Array.isArray(result.data) ? result.data : [];
    return items.map(item => normalizeMelolo(item));
}

// ====================================
// Combined/Utility Functions
// ====================================

export async function fetchAllTrending(): Promise<Drama[]> {
    const [dramaBox, melolo] = await Promise.all([
        fetchDramaBoxTrending(),
        fetchMeloloTrending()
    ]);

    return [...dramaBox, ...melolo].sort(() => Math.random() - 0.5);
}

export async function fetchAllLatest(): Promise<Drama[]> {
    const [dramaBox, melolo] = await Promise.all([
        fetchDramaBoxLatest(),
        fetchMeloloLatest()
    ]);

    return [...dramaBox, ...melolo].sort(() => Math.random() - 0.5);
}

export async function searchAll(query: string): Promise<Drama[]> {
    const [dramaBox, netShort, melolo] = await Promise.all([
        searchDramaBox(query),
        searchNetShort(query),
        searchMelolo(query)
    ]);

    return [...dramaBox, ...netShort, ...melolo];
}
