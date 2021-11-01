export interface PageRequest {
    page?: number,
    size?: number
}

export interface Sort {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
}

export interface Pageable {
    sort: Sort,
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    unpaged: boolean
}

export interface Pagination<T> {
    content: Array<T>,
    pageable: Pageable,
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort: Sort,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}