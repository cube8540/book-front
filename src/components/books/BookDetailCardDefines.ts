import moment from 'moment';

export interface BookDetailCardDefine {
    isbn: String,
    title: String,
    publisher: String,
    publishDate: Date | moment.Moment | String,
    thumbnail?: String,
    description?: String,
    authors?: Array<String>
}