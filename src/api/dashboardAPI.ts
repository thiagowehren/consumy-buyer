import type { DashboardResponse } from "@/dtos/dashboardDTO";
import { request } from './HTTPClient';

export async function getDashboardData(storeId: string): Promise<DashboardResponse> {
    const response = await request<DashboardResponse>(`/dashboard/${storeId}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }

    });

    if (!response) {
        throw new Error("Failed to fetch dashboard data.");
    }

    return response;
}
