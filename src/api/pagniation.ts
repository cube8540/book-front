export interface Sort {
    sorted: Boolean,
    unsorted: Boolean,
    empty: Boolean
}

export interface Pageable {
    sort: Sort,
    offset: Number,
    pageNumber: Number,
    pageSize: Number,
    paged: Boolean,
    unpaged: Boolean
}

export interface Pagination<T> {
    content: Array<T>,
    pageable: Pageable,
    last: Boolean,
    totalPages: Number,
    totalElements: Number,
    size: Number,
    number: Number,
    sort: Sort,
    first: Boolean,
    numberOfElements: Number,
    empty: Boolean
}