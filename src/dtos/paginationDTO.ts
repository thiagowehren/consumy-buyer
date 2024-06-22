export interface Pagination {
    current: number;
    per_page: number;
    pages: number;
    count: number;
    previous: number | null;
    next: number | null;
}
