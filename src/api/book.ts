import http from '@/api/http'

import moment from 'moment'

import {PageRequest, Pagination} from '@/api/pagniation'
import {AxiosResponse} from 'axios'

const baseUrl = '/v1/books'

const summaryUrl = baseUrl + '/summaries'

export interface BookSearchRequest extends PageRequest {
    publishFrom?: Date | string | moment.Moment,
    publishTo?: Date | string | moment.Moment,
    seriesIsbn?: string,
    seriesCode?: string,
    publisherCode?: string,
    title?: string,
    direction?: 'ASC' | 'DESC'
}

export enum ExternalSite {
    KYOBO = 'KYOBO',
    ALADIN = 'ALADIN'
}

export interface BookExternalLink {
    productDetailPage: string,
    originalPrice?: number,
    salePrice?: number
}

export interface BookDetail {
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
    seriesList?: Array<BookDetail>,
    indexes?: Array<String>,
    externalLinks?: Record<ExternalSite, BookExternalLink>,
    confirmedPublication?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export interface SummaryBookStatus {
    newestBooks?: Array<BookDetail>,
    latestUpdate?: Array<BookDetail>,
    publishedToday?: Array<BookDetail>
}

export async function summaries(): Promise<AxiosResponse<SummaryBookStatus>> {
    return http.get<SummaryBookStatus>(summaryUrl)
}

export async function search(request: BookSearchRequest): Promise<AxiosResponse<Pagination<BookDetail>>> {
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

    return http.get<Pagination<BookDetail>>(baseUrl, { params: requestCopy })
}

export async function getDetails(isbn: string): Promise<AxiosResponse<BookDetail>> {
    return http.get<BookDetail>(`${baseUrl}/${isbn}`)
}