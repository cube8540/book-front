<template>
  <v-layout v-if="bookDetail" column>
    <v-flex class="context-detail-box pa-10">
      <v-container>
        <v-layout row>
          <v-flex md3>
            <v-img :src="bookDetail.largeThumbnail"></v-img>
          </v-flex>
          <v-flex md9 class="px-5 py-2">
            <v-layout column>
              <v-flex>
                <h2>{{ bookDetail.title }}</h2>
              </v-flex>
              <v-flex class="grey--text text-darken-2">
                <span>{{ bookDetail.publisherName }}</span>
                <v-divider class="mx-2" v-if="bookDetail.authors && bookDetail.authors.length > 0" vertical></v-divider>
                <template v-for="(author, index) in bookDetail.authors">
                  <span class="d-inline-block text-no-wrap" :key="bookDetail.isbn + '_author_' + index">
                    {{ author }}
                  </span>
                  <v-divider
                      class="mx-2"
                      v-if="index < (bookDetail.authors.length - 1)"
                      :key="bookDetail.isbn + '_divider_' + index"
                      vertical
                  >
                  </v-divider>
                </template>
                <v-divider class="mx-2" vertical></v-divider>
                <span>{{ formattedPublishDate }}</span>
                <v-divider class="mx-2" vertical></v-divider>
                <span>{{ bookDetail.isbn }}</span>
              </v-flex>
              <v-divider class="my-3" v-if="hasExternalLinks"></v-divider>
              <v-flex  v-if="hasExternalLinks">
                <v-card
                  tile hover link class="mb-2"
                  v-for="(link, kind) in bookDetail.externalLinks"
                  :key="kind"
                  :href="link.productDetailPage"
                >
                  <v-card-title class="text-truncate">
                    {{ convertExternalKindToText(kind) }}
                  </v-card-title>
                  <v-card-text>
                    <span>
                      판매가: {{ link.salePrice }}원
                      [<span class="text-decoration-line-through">{{ link.originalPrice }}원</span>]
                    </span>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasSeries">
      <v-container>
        <v-row align="center">
          <v-divider></v-divider>
          <span class="pl-10 pr-10">이 책의 시리즈</span>
          <v-divider></v-divider>
        </v-row>
      </v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasSeries">
      <v-container>
        <v-row class="flex-wrap" justify="start">
          <v-col
            v-for="(series, index) in bookDetail.seriesList"
            cols="3"
            :key="series.isbn + '_series_' + index"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <router-link
                  v-on="{ ...on }"
                  :to="{ name: 'bookDetail', params: { isbn: series.isbn } }"
                  class="text-decoration-none grey--text text--darken-3"
                  :class="{ 'font-weight-bold': isbn === series.isbn }"
                  @click.native="scrollToTop"
                >
                  {{ series.title }}
                </router-link>
              </template>
              <span>{{ series.title }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasDescription">
      <v-container>
        <v-row align="center">
          <v-divider></v-divider>
          <span class="pl-10 pr-10">책 소개</span>
          <v-divider></v-divider>
        </v-row>
      </v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasDescription">
      <v-container v-html="formattedDescription"></v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasIndexes">
      <v-container>
        <v-row align="center">
          <v-divider></v-divider>
          <span class="pl-10 pr-10">목차</span>
          <v-divider></v-divider>
        </v-row>
      </v-container>
    </v-flex>
    <v-flex class="context-detail-box pa-10" v-if="hasIndexes">
      <v-container>
        <v-list-item
          v-for="(index, rowIndex) in bookDetail.indexes"
          :key="`${bookDetail.isbn}_index_${rowIndex}_${index}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ index }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, ref, Ref, watch} from '@vue/composition-api'

import {BookDetail, ExternalSite, getDetails} from '@/api/book'
import moment from "moment";

export default defineComponent({
  name: 'BookDetailPage',
  props: {
    isbn: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const bookDetail: Ref<BookDetail | undefined> = ref(undefined)

    const hasExternalLinks: ComputedRef<boolean> = computed(() => !!bookDetail.value?.externalLinks)
    const hasSeries: ComputedRef<boolean> = computed(() => !!bookDetail.value?.seriesList && bookDetail.value?.seriesList.length > 0)
    const hasDescription: ComputedRef<boolean> = computed(() => !!bookDetail.value?.description)
    const hasIndexes: ComputedRef<boolean> = computed(() => !!bookDetail.value?.indexes && bookDetail.value?.indexes.length > 0)

    const formattedDescription: ComputedRef<string | undefined> = computed(() => {
      if (bookDetail.value?.description) {
        return bookDetail.value?.description.replace(/\n/g, '<br />')
      } else {
        return undefined
      }
    })
    const formattedPublishDate: ComputedRef<string | undefined> = computed(() => {
      if (bookDetail.value?.publishDate instanceof Date) {
        return moment(bookDetail.value?.publishDate).format('YYYY년 MM월 DD일')
      } else if (bookDetail.value?.publishDate) {
        return moment(bookDetail.value?.publishDate, 'YYYY-MM-DD').format('YYYY년 MM월 DD일')
      } else {
        return undefined
      }
    })

    function convertExternalKindToText(text: string): string {
      if (text === ExternalSite.KYOBO) {
        return '교보문고'
      } else {
        return '알라딘'
      }
    }

    function scrollToTop() {
      window.scroll(0, 0)
    }

    getDetails(props.isbn).then(v => bookDetail.value = v.data)

    watch(() => props.isbn, (newIsbn) => getDetails(newIsbn).then(v => bookDetail.value = v.data))

    return {
      bookDetail,
      hasExternalLinks,
      hasSeries,
      hasDescription,
      hasIndexes,
      formattedDescription,
      formattedPublishDate,
      convertExternalKindToText,
      scrollToTop
    }
  }
})
</script>

<style scoped>
.context-detail-box:nth-child(2n) {
  background-color: #EEEEEE;
}
.context-detail-box .container,
.context-detail-box .layout {
  max-width: 1150px;
}
</style>