export type VideoQuality = '480P' | '720P' | '1080P' | '4K';

export interface MovieQuality {
  id?: string;
  quality: VideoQuality;
  fileSize: string;
  watchUrl: string;
  downloadUrl: string;
  authorized: boolean;
  format?: 'MP4' | 'MKV' | 'WebM';
}

export type MovieStatus = 'published' | 'draft' | 'archived';
export type ContentType = 'movie' | 'web-series';

export interface Movie {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  description: string;
  releaseYear: number;
  language: string;
  country: string;
  duration: string;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
  featured: boolean;
  trending: boolean;
  status: MovieStatus;
  qualities: MovieQuality[];
  createdAt: string;
  updatedAt: string;
  views: number;
  type?: ContentType;
  seasonsCount?: number;
  episodesCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  photoURL?: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  releaseYear: number;
  rating: number;
  language: string;
  addedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  quality: string;
  progressPercentage: number;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  language: string;
  genre: string;
  year: string;
  quality: string;
  type: string;
  sortBy: 'latest' | 'rating' | 'views' | 'title';
}

export type AdType =
  | 'header_banner'
  | 'homepage_banner'
  | 'details_banner'
  | 'category_banner'
  | 'native_ad'
  | 'watch_ad'
  | 'mobile_banner'
  | 'desktop_banner';

export type AdPlacement =
  | 'header_top'
  | 'homepage_top'
  | 'homepage_between'
  | 'homepage_bottom'
  | 'details_below_info'
  | 'details_before_watch'
  | 'details_below_trailer'
  | 'details_bottom'
  | 'category_top'
  | 'category_between'
  | 'watch_interstitial';

export type DeviceTarget = 'all' | 'desktop' | 'mobile';

export interface Advertisement {
  id: string;
  name: string;
  type: AdType;
  placement: AdPlacement;
  adCode?: string;
  imageUrl?: string;
  targetUrl: string;
  headline?: string;
  description?: string;
  callToAction?: string;
  sponsorName?: string;
  active: boolean;
  device: DeviceTarget;
  startDate?: string;
  endDate?: string;
  maxImpressions?: number;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AdEvent {
  id: string;
  adId: string;
  type: 'impression' | 'click';
  placement: AdPlacement;
  device: 'desktop' | 'mobile';
  timestamp: string;
}

