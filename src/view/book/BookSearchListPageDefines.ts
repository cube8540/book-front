import { Route } from "vue-router";
import { ref, computed, ComputedRef, Ref } from '@vue/composition-api'

import moment from 'moment'

import { BookSearchRequest } from '@/api/book'

type QueryParams = { [key: string]: string | undefined }

export const searchQueryParamsKey = {
    page: 'p',
    publisherCode: 'pub',
    yearMonth: 'ym'
}

export interface BookSearchRequestQueryParams {
    page: number | undefined,
    publisherCode: string | undefined,
    yearMonth: string | undefined
}

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

export function convertQueryParams(params: BookSearchRequest): QueryParams {
    const queryParams: QueryParams = {}

    queryParams[searchQueryParamsKey.page] = params.page ? params.page.toString() : undefined
    queryParams[searchQueryParamsKey.publisherCode] = params.publisherCode

    if (moment.isMoment(params.publishFrom)) {
        queryParams[searchQueryParamsKey.yearMonth] = params.publishFrom.format('YYYYMM')
    }

    return queryParams
}

export function searchConditionDefine(initDate: moment.Moment) {
    const selectedYearMonth: Ref<string> = ref(initDate.format('YYYY-MM'))

    const selectedPublisherCode: Ref<string | undefined> = ref(undefined)

    const selectedPage: Ref<number | undefined> = ref(1)
    const selectedSize: Ref<number | undefined> = ref(20)

    const publishFrom: ComputedRef<moment.Moment | undefined> = computed(() => {
        return moment(selectedYearMonth.value, 'YYYY-MM').clone().startOf('month')
    })
    const publishTo: ComputedRef<moment.Moment | undefined> = computed(() => {
        return moment(selectedYearMonth.value, 'YYYY-MM').clone().endOf('month')
    })

    const searchParams: ComputedRef<BookSearchRequest> = computed(() => ({
        page: selectedPage.value,
        size: selectedSize.value,
        publisherCode: selectedPublisherCode.value,
        publishFrom: publishFrom.value,
        publishTo: publishTo.value
    }))

    return {
        selectedYearMonth,
        selectedPage,
        selectedSize,
        selectedPublisherCode,
        searchParams,
    }
}