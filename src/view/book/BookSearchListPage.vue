<template>
  <v-container>
    <v-row align="center" justify="center">
      <app-month-picker
        v-model="selectedYearMonth"
        @input="onChangeConditionDefine"
      >
      </app-month-picker>
    </v-row>
    <v-row align="center" justify="end">
      <v-col
        v-if="isShowPagination"
        cols="8"
        class="d-md-flex d-none justify-center">
        <v-pagination
            v-model="selectedPage"
            :length="fetchedPage.totalPages"
            @input="onChangePageCondition"
        >
        </v-pagination>
      </v-col>
      <v-col md="2" cols="4">
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
    <v-dialog
      v-model="isShowDetailDialog"
      width="65%"
      scrollable
      :fullscreen="$vuetify.breakpoint.mobile"
      @input="onInputBookDetailViewerDialog"
    >
      <book-detail-view-dialog-context
        v-model="selectedBookIsbn"
        v-if="isShowDetailDialog"
        @close="onInputBookDetailViewerDialog(false)"
      >
      </book-detail-view-dialog-context>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'

import { SelectablePublisher } from '@/view/book/BookSearchListPageDefines'
import { extractQueryParams, convertQueryParams, extractHashParams } from "@/view/book/BookSearchListPageUtils";

import BookDetailCard from '@/components/books/BookDetailCard.vue'
import { BookDetailCardDefine } from "@/components/books/BookDetailCardDefines";
import AppMonthPicker from '@/components/pickers/AppMonthPicker.vue'

import { BookDetailsResponse, BookSearchRequest, search } from "@/api/book";
import { getAll } from "@/api/publisher";
import { Pagination } from "@/api/pagniation";

import BookDetailViewDialogContext from "@/view/book/BookDetailViewDialogContext.vue";

import moment from "moment";

function convertContent(content: Array<BookDetailsResponse> | undefined): Array<BookDetailCardDefine> {
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
    AppMonthPicker,
    BookDetailViewDialogContext,
  },
  setup(props, context: SetupContext) {
    const selectedYearMonth: Ref<string> = ref(moment().format('YYYY-MM'))

    const selectablePublishers: Ref<Array<SelectablePublisher>> = ref([])
    const selectedPublisherCode: Ref<string | undefined> = ref(undefined)

    const selectedPage: Ref<number | undefined> = ref(1)
    const selectedSize: Ref<number | undefined> = ref(20)

    const selectedBookIsbn: Ref<string | undefined> = ref(undefined)
    const isShowDetailDialog: Ref<boolean> = ref(false)

    const publishFrom: ComputedRef<moment.Moment | undefined> = computed(() => {
      return moment(selectedYearMonth.value, 'YYYY-MM').clone().startOf('month')
    })
    const publishTo: ComputedRef<moment.Moment | undefined> = computed(() => {
      return moment(selectedYearMonth.value, 'YYYY-MM').clone().endOf('month')
    })

    const fetchedPage: Ref<Pagination<BookDetailsResponse> | undefined> = ref(undefined)

    const searchParams: ComputedRef<BookSearchRequest> = computed(() => ({
      page: selectedPage.value,
      size: selectedSize.value,
      publisherCode: selectedPublisherCode.value,
      publishFrom: publishFrom.value,
      publishTo: publishTo.value
    }))

    const fetchedContent: ComputedRef<Array<BookDetailCardDefine>> =
        computed(() => convertContent(fetchedPage.value?.content))
    const isShowPagination: ComputedRef<boolean> = computed(() => fetchedContent.value && fetchedContent.value.length > 0)

    const fetchBookList = (): Promise<void> => {
      window.scrollTo(0, 0)
      return search(searchParams.value)
          .then(v => fetchedPage.value = v.data)
    }

    const openBookDetailViewerByHashParams = (writeHistory: boolean = true): Promise<void> => {
      const hashParams = extractHashParams(context.root.$route)
      if (hashParams.isbn && fetchedPage.value?.content.find(v => v.isbn === hashParams.isbn)) {
        onClickBookDetail(hashParams.isbn, writeHistory)
      } else {
        onInputBookDetailViewerDialog(false, writeHistory)
      }
      return new Promise<void>((resolve) => resolve())
    }

    const pushQueryParamInRouter = (h: string | undefined = undefined): Promise<void> => {
      const query = convertQueryParams(searchParams.value)
      const hash = h !== undefined ? h : context.root.$route.hash
      return context.root.$router.push({ query, hash })
    }

    const onChangePageCondition =() => {
      fetchBookList().then(openBookDetailViewerByHashParams).then(pushQueryParamInRouter)
    }

    const onChangeConditionDefine = () => {
      selectedPage.value = 1
      onChangePageCondition()
    }

    const onClickBookDetail = (isbn: string, writeHistory: boolean = true) => {
      selectedBookIsbn.value = isbn
      isShowDetailDialog.value = true
      if (writeHistory) {
        pushQueryParamInRouter('isbn=' + isbn)
      }
    }

    const onInputBookDetailViewerDialog = (input: boolean, writeHistory: boolean = true) => {
      if (!input) {
        selectedBookIsbn.value = undefined
        if (writeHistory) {
          pushQueryParamInRouter('')
        }
      }
      isShowDetailDialog.value = input
    }

    const onPageLoad = (): Promise<void> => {
      const queryParams = extractQueryParams(context.root.$route)
      selectedPage.value = queryParams.page
      selectedPublisherCode.value = queryParams.publisherCode
      if (queryParams.yearMonth) {
        selectedYearMonth.value = queryParams.yearMonth
      }
      return fetchBookList()
    }

    window.onpopstate = () => {
      onPageLoad().then(openBookDetailViewerByHashParams(false))
    }
    onPageLoad().then(openBookDetailViewerByHashParams).then(pushQueryParamInRouter)
    getAll().then(v => {
      const selectable: Array<SelectablePublisher> = [{ code: null, name: '전체' }]

      v.data.results.forEach(p => selectable.push({ code: p.code, name: p.name }))
      selectablePublishers.value = selectable
    })

    return {
      selectedYearMonth,
      selectablePublishers,
      selectedPublisherCode,
      selectedPage,
      selectedSize,
      selectedBookIsbn,
      isShowDetailDialog,
      fetchedPage,
      fetchedContent,
      isShowPagination,
      onChangePageCondition,
      onChangeConditionDefine,
      onClickBookDetail,
      onInputBookDetailViewerDialog,
    }
  },
  beforeUnmount() {
    window.onpopstate = null
  }
})

</script>

<style scoped>
</style>