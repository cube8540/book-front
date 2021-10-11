import { Route } from "vue-router";

import moment from "moment";

import { BookSearchRequest } from "@/api/book";

import { QueryParams } from "@/view/QueryParams";
import { BookListPageHashParams, BookSearchRequestQueryParams, searchQueryParamsKey, hashParamsKey } from "@/view/book/BookSearchListPageDefines";

export function extractQueryParams(route: Route): BookSearchRequestQueryParams {
    const queryParamMap = {
        page: route.query[searchQueryParamsKey.page],
        publisherCode: route.query[searchQueryParamsKey.publisherCode],
        yearMonth: route.query[searchQueryParamsKey.yearMonth]
    }

    const result: BookSearchRequestQueryParams = {
        page: undefined,
        yearMonth: undefined,
        publisherCode: undefined
    }
    if (queryParamMap.page && /^\d+$/.test(queryParamMap.page.toString())) {
        result.page = Number(queryParamMap.page)
    } else {
        result.page = 1
    }
    if (queryParamMap.publisherCode) {
        result.publisherCode = queryParamMap.publisherCode.toString()
    }
    if (queryParamMap.yearMonth && /\d{6}/.test(queryParamMap.yearMonth.toString())) {
        result.yearMonth = moment(queryParamMap.yearMonth.toString(), 'YYYYMM').format('YYYY-MM')
    }

    return result
}

export function extractHashParams(route: Route): BookListPageHashParams {
    const splitParams = route.hash.split('&')
        .map(p => p.replace(/^#/, ''))

    const result: BookListPageHashParams = { isbn: undefined }
    splitParams.forEach(v => {
        const keyValue = v.split('=')
        if (keyValue.length === 2) {
            if (keyValue[0] === hashParamsKey.isbn) {
                result.isbn = keyValue[1]
            }
        }
    })
    return result
}

export function convertQueryParams(params: BookSearchRequest): QueryParams {
    const queryParams: QueryParams = {}

    queryParams[searchQueryParamsKey.page] = params.page ? params.page.toString() : undefined
    queryParams[searchQueryParamsKey.publisherCode] = params.publisherCode

    if (moment.isMoment(params.publishFrom)) {
        queryParams[searchQueryParamsKey.yearMonth] = params.publishFrom.format('YYYYMM')
    }

    return queryParams
}

export function convertHashParams(params: BookListPageHashParams): string {
    const hashParams = Object.keys(params)
        // @ts-ignore
        .map(k => `${k}=${params[k]}`)
        .join('&')
    return hashParams.length > 0 ? `#${hashParams}` : ''
}