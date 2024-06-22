import { Pagination } from './paginationDTO';

export interface ProductResponse {
    id: number;
    title: string;
    price: string | null;
    image_url: string | null;
    hidden?: boolean;               // when seller 
	store_url?: string;             // from: GET stores/:id/products/:id
    expires_at?: string | null;
}

export interface ProductsResponse {
    pagination: Pagination;
    products: ProductResponse[];
}

export interface CreateProduct {
    product: {
        title: string;
        price?: string;
        hidden?: boolean;
        image?: File | Blob;
        expires_in: number;
    }
}
