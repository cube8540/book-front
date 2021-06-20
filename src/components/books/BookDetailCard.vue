<template>
  <v-card elevation="2" outlined>
    <div class="d-flex align-center">
      <div class="pa-2">
        <v-img
          :width="thumbnailWidth"
          :height="thumbnailHeight"
          :src="bookDetails.thumbnail"
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
      </div>
      <div class="align-self-stretch">
        <v-card-title>{{ bookDetails.title }}</v-card-title>
        <v-card-subtitle class="d-flex">
          <span class="d-inline-block text-no-wrap">
            {{ bookDetails.publisher }}
          </span>
          <v-divider class="mx-2" vertical></v-divider>
          <span class="d-inline-block text-no-wrap">
            {{ formattedPublishDate }}
          </span>
          <v-divider class="mx-2" v-if="bookDetails.authors && bookDetails.authors.length > 0" vertical></v-divider>
          <template v-for="(author, index) in bookDetails.authors">
            <span
              class="d-inline-block text-no-wrap"
              :key="bookDetails.isbn + '_author_' + index"
            >
              {{ author }}
            </span>
            <v-divider
              class="mx-2"
              v-if="index < (bookDetails.authors.length - 1)"
              :key="bookDetails.isbn + '_divider_' + index"
              vertical
            >
            </v-divider>
          </template>
        </v-card-subtitle>
        <v-card-text>
          {{ formattedDescription }}
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from '@vue/composition-api'

import moment from 'moment';
import { BookDetailCardDefine } from '@/components/books/BookDetailCardDefines';

export default defineComponent({
  name: 'BookDetailCard',
  props: {
    bookDetails: {
      type: Object as PropType<BookDetailCardDefine>,
      required: true
    },
    maxDescriptionLength: {
      type: Number,
      default: 100,
      required: false
    },
    thumbnailWidth: {
      type: String,
      default: '150px',
      required: false
    },
    thumbnailHeight: {
      type: String,
      default: '220px',
      required: false
    }
  },
  setup(props) {
    const formattedPublishDate = computed(() => {
      if (props.bookDetails.publishDate instanceof Date) {
        return moment(props.bookDetails.publishDate).format('YYYY-MM-DD')
      } else if (moment.isMoment(props.bookDetails.publishDate)) {
        return props.bookDetails.publishDate.format('YYYY-MM-DD')
      } else {
        return props.bookDetails.publishDate
      }
    })

    const maxDescriptionLength = props.maxDescriptionLength
    const formattedDescription = computed(() => {
      if (props.bookDetails.description && props.bookDetails.description.length > maxDescriptionLength) {
        return props.bookDetails.description.substring(0, maxDescriptionLength) + '...'
      } else {
        return props.bookDetails.description
      }
    })

    return {
      formattedDescription,
      formattedPublishDate
    }
  }
})
</script>

<style scoped>
</style>