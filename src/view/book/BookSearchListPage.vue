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
            @input="onFetchPage"
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
          @input="onFetchPage"
        >
        </v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef, ref, Ref, SetupContext } from '@vue/composition-api'

import moment from "moment";

import { searchConditionDefine, extractQueryParams, convertQueryParams } from '@/view/book/BookSearchListPageDefines'

import { BookDetailsResponse, search } from '@/api/book'
import { PublisherElement, getAll } from '@/api/publisher'
import { Pagination } from '@/api/pagniation'

import { BookDetailCardDefine } from '@/components/books/BookDetailCardDefines'
import BookDetailCard from '@/components/books/BookDetailCard.vue'

import AppMonthPicker from '@/components/pickers/AppMonthPicker.vue'

interface SelectablePublisher {
  code?: string | null,
  name?: string
}

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
  },
  setup(props, context: SetupContext) {
    const conditionDefine = searchConditionDefine(moment())
    const queryParams = extractQueryParams(context.root.$route)

    const selectablePublishers: Ref<Array<SelectablePublisher>> = ref([])

    conditionDefine.selectedPage.value = queryParams.page
    conditionDefine.selectedPublisherCode.value = queryParams.publisherCode
    if (queryParams.yearMonth) {
      conditionDefine.selectedYearMonth.value = queryParams.yearMonth
    }

    const fetchedPage: Ref<Pagination<BookDetailsResponse> | undefined> = ref(undefined)
    const fetchedContent: ComputedRef<Array<BookDetailCardDefine>> =
        computed(() => convertContent(fetchedPage.value?.content))

    const pushRouteQuery = () => {
      const queryParams = convertQueryParams(conditionDefine.searchParams.value)
      context.root.$router.replace({ query: queryParams })
    }

    const onFetchPage = () => {
      pushRouteQuery()
      window.scrollTo(0, 0)
      search(conditionDefine.searchParams.value)
          .then(v => fetchedPage.value = v.data)
    }

    const onChangeConditionDefine = () => {
      conditionDefine.selectedPage.value = 1
      onFetchPage()
    }

    getAll().then(v => {
      const selectable: Array<SelectablePublisher> = [{ code: null, name: '전체' }]

      v.data.results.forEach((publisher: PublisherElement) => {
        selectable.push({ code: publisher.code, name: publisher.name })
      })

      selectablePublishers.value = selectable
    })

    const isShowPagination: ComputedRef<boolean> = computed(() => fetchedContent.value && fetchedContent.value.length > 0)

    onFetchPage()
    return {
      ...conditionDefine,
      fetchedPage,
      fetchedContent,
      selectablePublishers,
      isShowPagination,
      onFetchPage,
      onChangeConditionDefine
    }
  }
})

</script>

<style scoped>
</style>