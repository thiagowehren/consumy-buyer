import type { SearchResponse } from "@/dtos/searchDTO"
import { request } from './HTTPClient';

export async function searchAll(search: string): Promise<SearchResponse> {
    const response = await request<SearchResponse>('/search', {
        method: "POST",
        params: { search },
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response) {
        throw new Error("Failed to fetch stores.");
    }
    return response;
}