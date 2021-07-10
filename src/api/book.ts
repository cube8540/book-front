import http from '@/api/http'

import moment from 'moment'

import { Pagination } from '@/api/pagniation'
import { AxiosResponse } from "axios"

const baseUrl = '/v1/books'

export interface BookSearchRequest {
    publishFrom?: Date | string | moment.Moment,
    publishTo?: Date | string | moment.Moment,
    seriesIsbn?: string,
    seriesCode?: string,
    publisherCode?: string,
    direction?: 'ASC' | 'DESC',
    page?: number,
    size?: number
}

export interface BookDetailsResponse {
    isbn: string,
    title: string,
    publishDate: Date,
    publisherCode: string,
    publisherName: string,
    seriesIsbn?: string,
    seriesCode?: string,
    largeThumbnail?: string,
    mediumThumbnail?: string,
    smallThumbnail?: string,
    authors?: Array<string>,
    description?: string,
    price?: number,
    seriesList?: Array<BookDetailsResponse>,
    createdAt?: Date,
    updatedAt?: Date
}

export async function search(request: BookSearchRequest): Promise<AxiosResponse<Pagination<BookDetailsResponse>>> {
    const requestCopy = { ...request };

    if (!requestCopy.direction) {
        requestCopy.direction = 'ASC'
    }

    if (requestCopy.publishFrom instanceof Date) {
        requestCopy.publishFrom = moment(requestCopy.publishFrom).format('YYYYMMDD')
    } else if (moment.isMoment(requestCopy.publishFrom)) {
        requestCopy.publishFrom = requestCopy.publishFrom.format('YYYYMMDD')
    }

    if (requestCopy.publishTo instanceof Date) {
        requestCopy.publishFrom = moment(requestCopy.publishTo).format('YYYYMMDD')
    } else if (moment.isMoment(requestCopy.publishTo)) {
        requestCopy.publishTo = requestCopy.publishTo.format('YYYYMMDD')
    }

    return http.get<Pagination<BookDetailsResponse>>(baseUrl, { params: requestCopy })
}

export async function getDetails(isbn: string): Promise<AxiosResponse<BookDetailsResponse>> {
    return http.get<BookDetailsResponse>(`${baseUrl}/${isbn}`)
}