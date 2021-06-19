import { ref, computed, ComputedRef, Ref } from '@vue/composition-api'

import moment from 'moment'

import { BookSearchRequest } from '@/api/book'

export function searchConditionDefine(initDate: moment.Moment) {
    const selectedYearMonth: Ref<String> = ref(initDate.format('YYYY-MM'))

    const selectedPublisherCode: Ref<String | undefined> = ref(undefined)

    const selectedPage: Ref<Number | undefined> = ref(1)
    const selectedSize: Ref<Number | undefined> = ref(20)

    const publishFrom: ComputedRef<moment.Moment | undefined> = computed(() => {
        return moment(selectedYearMonth.value.toString(), 'YYYY-MM').clone().startOf('month')
    })
    const publishTo: ComputedRef<moment.Moment | undefined> = computed(() => {
        return moment(selectedYearMonth.value.toString(), 'YYYY-MM').clone().endOf('month')
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