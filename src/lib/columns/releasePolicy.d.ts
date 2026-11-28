import type { Article } from './types';
export function timestamp(value: string): number;
export function publicationInstant(article: Pick<Article, 'publishedAt' | 'publishedTimestamp'>): number;
export function eligibleState(article: Partial<Article> | null | undefined, previewPending?: boolean): boolean;
export function selectReleased(records: readonly Article[], now: number, previewPending?: boolean): Article[];
