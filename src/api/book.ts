import http from '@/api/http'

import moment from 'moment'

import { Pagination } from '@/api/pagniation'
import { AxiosResponse } from "axios"

export interface BookSearchRequest {
    publishFrom?: Date | String | moment.Moment,
    publishTo?: Date | String | moment.Moment,
    seriesIsbn?: String,
    seriesCode?: String,
    publisherCode?: String,
    direction?: 'ASC' | 'DESC',
    page?: Number,
    size?: Number
}

export interface BookSearchResponse {
    isbn: String,
    title: String,
    publishDate: Date,
    publisherCode: String,
    publisherName: String,
    seriesIsbn?: String,
    seriesCode?: String,
    largeThumbnail?: String,
    mediumThumbnail?: String,
    smallThumbnail?: String,
    authors?: Array<String>,
    description?: String,
    price?: Number,
    createdAt?: Date,
    updatedAt?: Date
}

export async function search(request: BookSearchRequest): Promise<AxiosResponse<Pagination<BookSearchResponse>>> {
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

    return http.get<Pagination<BookSearchResponse>>('/v1/books', { params: requestCopy })
}