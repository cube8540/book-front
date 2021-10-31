export interface SelectablePublisher {
    code?: string | null,
    name?: string
}

export interface BookSearchRequestQueryParams {
    page: number | undefined,
    publisherCode: string | undefined,
    yearMonth: string | undefined,
    title: string | undefined
}

export interface BookListPageHashParams {
    isbn: string | undefined
}

export const searchQueryParamsKey = {
    page: 'p',
    publisherCode: 'pub',
    yearMonth: 'ym',
    title: 'title'
}

export const hashParamsKey = {
    isbn: 'isbn'
}