import http from '@/api/http'

import { AxiosResponse } from 'axios'

export interface PublisherElement {
    code: String,
    name: String,
    createdAt?: Date,
    updatedAt?: Date
}

export interface PublisherElementResponse {
    results: Array<PublisherElement>
}

export async function getAll(): Promise<AxiosResponse<PublisherElementResponse>> {
    return http.get<PublisherElementResponse>('/v1/publishers')
}