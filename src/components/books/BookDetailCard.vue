<template>
  <v-card :elevation="hoverElevation" @click="onClickCard">
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
          <span>
            {{ bookDetails.publisher }}
          </span>
          <v-divider class="mx-2" vertical></v-divider>
          <span>
            {{ formattedPublishDate }}
          </span>
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
  emits: ['selected-book'],
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
    },
    hover: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup(props, context) {
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

    const bookDetailLink = computed(() => `/books/${props.bookDetails.isbn}`)

    const hoverElevation = computed(() => props.hover ? 16 : 2)

    const onClickCard = () => {
      context.root.$router.push({ name: 'bookDetail', params: { isbn: props.bookDetails.isbn } })
    }

    return {
      formattedDescription,
      formattedPublishDate,
      bookDetailLink,
      hoverElevation,
      onClickCard,
    }
  }
})
</script>

<style scoped>
</style>