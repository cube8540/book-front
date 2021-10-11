<template>
  <v-card>
    <v-toolbar flat dark color="primary">
      <v-spacer></v-spacer>
      <v-btn color="white" icon @click="onClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container v-if="bookDetail" fluid class="overflow-y-auto">
      <v-row justify="center">
        <v-col lg="3" cols="12">
          <v-img
            class="mx-auto mt-2"
            :src="bookDetail.largeThumbnail"
            :max-width="maxThumbnailWidth"
            :max-height="maxThumbnailHeight"
          >
            <template #placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                >
                </v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col lg="9" cols="12" class="book-detail">
          <v-card-title>{{ bookDetail.title }}</v-card-title>
          <v-card-subtitle class="d-flex flex-wrap pt-2 grey--text text--darken-2">
            <span>{{ bookDetail.publisherName }}</span>
            <v-divider class="mx-2" v-if="bookDetail.authors && bookDetail.authors.length > 0" vertical></v-divider>
            <template v-for="(author, index) in bookDetail.authors">
            <span
              class="d-inline-block text-no-wrap"
              :key="bookDetail.isbn + '_author_' + index"
            >
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
            <span>{{ formattedPublishDate }} 출간 예정</span>
            <v-divider class="mx-2" vertical></v-divider>
            <span>{{ bookDetail.isbn }}</span>
          </v-card-subtitle>
          <v-divider v-if="bookDetail.description"></v-divider>
          <v-card-text v-if="bookDetail.description">
            <div class="grey--text text--darken-2 pa-4 pt-0 pl-0">책소개</div>
            <div v-html="formattedDescription"></div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="grey--text text--darken-1 pa-4 pt-0 pl-0">이 책의 시리즈</div>
            <div class="container--fluid">
              <v-row class="flex-wrap" justify="start">
                <v-col
                  class="another-series"
                  v-for="(series, index) in bookDetail.seriesList"
                  cols="3"
                  :key="series.isbn + '_series_' + index"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span
                        v-on="{ ...on }"
                        v-bind:class="{ 'text--disabled': value === series.isbn }"
                        @click="onClickAnotherSeries(series.isbn)"
                      >
                        {{ series.title }}
                      </span>
                    </template>
                    <span>{{ series.title }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text v-if="!bookDetail" class="pt-3">
      Please wait...
      <v-progress-linear
        indeterminate
        color="primary"
        class="mb-0"
      >
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, ComputedRef, computed, watch } from '@vue/composition-api'

import moment from "moment";
import { AxiosResponse } from "axios"

import { BookDetailsResponse, getDetails } from '@/api/book'

export default defineComponent({
  name: 'BookDetailViewDialogContext',
  emits: ['close'],
  props: {
    value: {
      type: String,
      required: true
    },
    maxThumbnailWidth: {
      type: [Number, String],
      default: '300px',
      required: false,
    },
    maxThumbnailHeight: {
      type: [Number, String],
      default: '440px',
      required: false,
    }
  },
  setup(props, context) {
    const bookDetail: Ref<BookDetailsResponse | undefined> = ref(undefined)
    const errorMessage: Ref<string | undefined> = ref(undefined)

    const formattedPublishDate: ComputedRef<string | undefined> = computed(() => {
      if (bookDetail.value?.publishDate instanceof Date) {
        return moment(bookDetail.value?.publishDate).format('YYYY년 MM월 DD일')
      } else if (bookDetail.value?.publishDate) {
        return moment(bookDetail.value?.publishDate, 'YYYY-MM-DD').format('YYYY년 MM월 DD일')
      } else {
        return undefined
      }
    })

    const formattedDescription: ComputedRef<string | undefined> = computed(() => {
      if (bookDetail.value?.description) {
        return bookDetail.value?.description.replace(/\n/g, '<br />')
      } else {
        return ''
      }
    })

    const onClickAnotherSeries = (isbn: string) => {
      if (props.value !== isbn) {
        context.emit('input', isbn)
      }
    }

    const fetchDetail = (isbn: string) => {
      bookDetail.value = undefined
      getDetails(isbn)
          .then(value => bookDetail.value = value.data)
          .catch((response: AxiosResponse) => {
            if (response.status === 404) {
              errorMessage.value = `존재 하지 않는 ISBN 입니다. (${isbn})`
            }
          })
    }

    const onClose = () => {
      context.emit('close')
    }

    watch(() => props.value, fetchDetail)

    fetchDetail(props.value)
    return {
      bookDetail,
      errorMessage,
      formattedPublishDate,
      formattedDescription,
      onClickAnotherSeries,
      onClose
    }
  }
})
</script>

<style scoped>
.another-series > span {
  cursor: pointer;
}
.another-series > span.text--disabled {
  cursor: default;
}
</style>