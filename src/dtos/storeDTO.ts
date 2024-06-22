import { Pagination } from './paginationDTO';

export interface StoreResponse {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    url: string;
    image_url: string | null;
    hidden?: boolean;               // when seller
}

export interface StoresResponse {
    pagination: Pagination;
    stores: StoreResponse[];
}

export interface CreateStore {
    store: {
        name: string;
        hidden?: boolean;
        image?: File | Blob;
    }
}
