 <template>
  <v-container :style="contentStyle">
    <v-row justify="center" align="center">
      <v-col cols="2" class="text-center">
        <v-btn icon @click="previous">
          <v-icon :size="buttonSize">mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="8">
        <v-menu
            v-model="displayPicker"
            allow-overflow
            offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="text-center" :style="textStyle" v-bind="attrs" v-on="on">
              <span class="ml-1 mr-1">{{ selectedYear }}년</span>
              <span class="ml-1 mr-1">{{ selectedMonth }}월</span>
            </div>
          </template>
          <v-date-picker
              v-model="value"
              type="month"
              no-title
              scrollable
              @input="onChange"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-btn icon @click="next">
          <v-icon :size="buttonSize">mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import moment from 'moment'

const dataController = ({ initDate, emit }) => {
  const displayPicker = ref(false)
  const value = ref(moment(initDate).format('YYYY-MM'))

  const dateValue = computed(() => moment(value.value, 'YYYY-MM'))
  const selectedYear = computed(() => dateValue.value.year())
  const selectedMonth = computed(() => dateValue.value.month() + 1);

  const onChange = (value) => {
    const date = moment(value, 'YYYY-MM')

    displayPicker.value = false
    emit('onChange', { year: date.year(), month: date.month() })
  }

  const previous = () => {
    dateValue.value = dateValue.value.add(-1, 'month')
    value.value = dateValue.value.format('YYYY-MM')

    onChange(value.value)
  }
  const next = () => {
    dateValue.value = dateValue.value.add(1, 'month')
    value.value = dateValue.value.format('YYYY-MM')

    onChange(value.value)
  }

  return { displayPicker, value, selectedYear, selectedMonth, onChange, previous, next  }
}

const styleController = ({ maxWidth, fontSize, textColor }) => {
  const contentStyle = ref(`max-width: ${maxWidth}`)
  const textStyle = ref(`font-size: ${fontSize}; color: ${textColor}`)

  return { contentStyle, textStyle }
}

export default defineComponent({
  name: 'AppMonthPicker',
  emits: [ 'onChange' ],
  props: {
    initDate: {
      type: Date,
      default: new Date(),
      required: false
    },
    maxWidth: {
      type: String,
      default: '400px',
      required: false
    },
    fontSize: {
      type: String,
      default: '1.5rem',
      required: false
    },
    textColor: {
      type: String,
      default: '#222',
      required: false
    },
    buttonSize: {
      type: String | Number,
      default: '20px',
      required: false,
    }
  },
  setup(props, { emit }) {
    return {
      ...dataController({
        initDate: props.initDate,
        emit
      }),
      ...styleController({
        maxWidth: props.maxWidth,
        fontSize: props.fontSize,
        textColor: props.textColor
      })
    }
  }
})
</script>

<style scoped>
</style>