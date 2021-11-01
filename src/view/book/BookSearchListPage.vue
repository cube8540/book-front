<template>
  <v-layout align-center justify-center>
    <v-container>
      <v-row align="center" justify="center" v-if="showYearMonth">
        <app-month-picker
          v-model="selectedYearMonth"
          @input="onChangeConditionDefine"
        >
        </app-month-picker>
      </v-row>
      <v-row align="center" justify="end">
        <v-col md="6" xl="4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="searchTitleQuery"
                label="제목"
                append-icon="mdi-magnify"
                @keydown.enter="onChangeConditionDefine"
                @click:append="onChangeConditionDefine"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedPublisherCode"
                label="출판사"
                item-text="name"
                item-value="code"
                :items="selectablePublishers"
                @input="onChangeConditionDefine"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
        v-for="content in fetchedContent"
        :key="content.isbn"
      >
        <v-col cols="12">
          <v-hover v-slot="{ hover }">
            <book-detail-card
              :hover="hover"
              :book-details="content"
              @selected-book="onClickBookDetail"
            >
            </book-detail-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row v-if="fetchedPage" align="center" justify="center">
        <v-col lg="12" cols="8">
          <v-pagination
            v-if="isShowPagination"
            v-model="selectedPage"
            :length="fetchedPage.totalPages"
            @input="onChangePageCondition"
          >
          </v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, ref, Ref, SetupContext} from '@vue/composition-api'

import {SelectablePublisher} from '@/view/book/BookSearchListPageDefines'
import {convertQueryParams, extractQueryParams} from "@/view/book/BookSearchListPageUtils"

import BookDetailCard from '@/components/books/BookDetailCard.vue'
import {BookDetailCardDefine} from "@/components/books/BookDetailCardDefines"
import AppMonthPicker from '@/components/pickers/AppMonthPicker.vue'

import {BookDetail, BookSearchRequest, search} from "@/api/book"
import {getAll} from "@/api/publisher"
import {Pagination} from "@/api/pagniation"

import moment from "moment"

function convertContent(content: Array<BookDetail> | undefined): Array<BookDetailCardDefine> {
  if (!content || content.length === 0) {
    return []
  }
  return content.map<BookDetailCardDefine>(v => ({
    isbn: v.isbn,
    title: v.title,
    publisher: v.publisherName,
    authors: v.authors,
    publishDate: v.publishDate,
    thumbnail: v.mediumThumbnail,
    description: v.description
  }))
}

export default defineComponent({
  name: 'BookSearchListPage',
  components: {
    BookDetailCard,
    AppMonthPicker
  },
  setup(props, context: SetupContext) {
    const showYearMonth: Ref<boolean> = ref(true)
    const selectedYearMonth: Ref<string> = ref(moment().format('YYYY-MM'))

    const selectablePublishers: Ref<Array<SelectablePublisher>> = ref([])
    const selectedPublisherCode: Ref<string | undefined> = ref(undefined)

    const selectedPage: Ref<number | undefined> = ref(1)
    const selectedSize: Ref<number | undefined> = ref(20)

    const selectedBookIsbn: Ref<string | undefined> = ref(undefined)
    const isShowDetailDialog: Ref<boolean> = ref(false)

    const searchTitleQuery: Ref<string | undefined> = ref(undefined)

    const publishFrom: ComputedRef<moment.Moment | undefined> = computed(() => {
      return moment(selectedYearMonth.value, 'YYYY-MM').clone().startOf('month')
    })
    const publishTo: ComputedRef<moment.Moment | undefined> = computed(() => {
      return moment(selectedYearMonth.value, 'YYYY-MM').clone().endOf('month')
    })

    const fetchedPage: Ref<Pagination<BookDetail> | undefined> = ref(undefined)

    const searchParams: ComputedRef<BookSearchRequest> = computed(() => ({
        page: selectedPage.value,
        size: selectedSize.value,
        title: searchTitleQuery.value,
        publisherCode: selectedPublisherCode.value,
        publishFrom: !searchTitleQuery.value ? publishFrom.value : undefined,
        publishTo: !searchTitleQuery.value ? publishTo.value : undefined
    }))

    const fetchedContent: ComputedRef<Array<BookDetailCardDefine>> =
        computed(() => convertContent(fetchedPage.value?.content))
    const isShowPagination: ComputedRef<boolean> = computed(() => fetchedContent.value && fetchedContent.value.length > 0)

    function fetchBookList(): Promise<void> {
      window.scrollTo(0, 0)
      return new Promise<void>(resolve => {
        showYearMonth.value = !searchParams.value.title
        search(searchParams.value)
            .then(v => {
              fetchedPage.value = v.data
              resolve()
            })
      })
    }

    function applyQueryParam() {
      const queryParams = extractQueryParams(context.root.$route)
      selectedPage.value = queryParams.page
      selectedPublisherCode.value = queryParams.publisherCode
      searchTitleQuery.value = queryParams.title
      if (queryParams.yearMonth) {
        selectedYearMonth.value = queryParams.yearMonth
      }
    }

    function pushQueryParamInRouter(): Promise<void> {
      const query = convertQueryParams(searchParams.value)

      return new Promise<void>(resolve => {
        context.root.$router.push({ query })
            .then(() => resolve())
            .catch(err => {
              if (err.name !== 'NavigationDuplicated') {
                throw err
              }
            })
      })
    }

    function onChangePageCondition() {
      fetchBookList().then(() => pushQueryParamInRouter())
    }

    function onChangeConditionDefine() {
      selectedPage.value = 1
      onChangePageCondition()
    }

    function onClickBookDetail(isbn: string) {
      context.root.$router.push({ name: 'bookDetail', params: { isbn } })
    }

    getAll().then(v => {
      const selectable: Array<SelectablePublisher> = [{ code: null, name: '전체' }]

      v.data.results.forEach(p => selectable.push({ code: p.code, name: p.name }))
      selectablePublishers.value = selectable

      applyQueryParam()
      fetchBookList().then(() => pushQueryParamInRouter())
    })

    window.onpopstate = function() {
      applyQueryParam()
      fetchBookList()
    }

    return {
      showYearMonth,
      selectedYearMonth,
      selectablePublishers,
      selectedPublisherCode,
      searchTitleQuery,
      selectedPage,
      selectedSize,
      selectedBookIsbn,
      isShowDetailDialog,
      fetchedPage,
      fetchedContent,
      isShowPagination,
      onChangePageCondition,
      onChangeConditionDefine,
      onClickBookDetail
    }
  },
  beforeUnmount() {
    window.onpopstate = null
  }
})

</script>

<style scoped>
</style>