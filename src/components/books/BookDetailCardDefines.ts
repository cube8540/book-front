import moment from 'moment';

export interface BookDetailCardDefine {
    isbn: string,
    title: string,
    publisher: string,
    publishDate: Date | moment.Moment | string,
    thumbnail?: string,
    description?: string,
    authors?: Array<string>
}