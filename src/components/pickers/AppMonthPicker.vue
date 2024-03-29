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
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="text-center" :style="textStyle" v-bind="attrs" v-on="on">
              <span class="ml-1 mr-1">{{ selectedYear }}년</span>
              <span class="ml-1 mr-1">{{ selectedMonth }}월</span>
            </div>
          </template>
          <v-date-picker
            v-model="initialize"
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

<script lang="ts">
import {computed, defineComponent, ref, SetupContext} from '@vue/composition-api'
import moment from 'moment'

const valueRegex = /\d{4}-\d{2}/

export default defineComponent({
  name: 'AppMonthPicker',
  props: {
    value: {
      type: String,
      required: true,
      validator(value: string) {
        return valueRegex.test(value)
      }
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
      type: String,
      default: '20px',
      required: false,
    }
  },
  setup(props: { value: string, maxWidth: string, fontSize: string, textColor: string, buttonSize: string }, context: SetupContext) {
    const displayPicker = ref(false)
    const initialize = ref(props.value)

    const dateValue = computed(() => moment(props.value, 'YYYY-MM'))
    const selectedYear = computed(() => dateValue.value.year())
    const selectedMonth = computed(() => dateValue.value.month() + 1);

    const contentStyle = ref(`max-width: ${props.maxWidth}`)
    const textStyle = ref(`font-size: ${props.fontSize}; color: ${props.textColor}`)

    const onChange = (value: string) => {
      displayPicker.value = false
      context.emit('input', value)
    }
    const previous = () => {
      onChange(dateValue.value.add(-1, 'month').format('YYYY-MM'))
    }
    const next = () => {
      onChange(dateValue.value.add(1, 'month').format('YYYY-MM'))
    }

    return {
      displayPicker,
      initialize,
      selectedYear,
      selectedMonth,
      contentStyle,
      textStyle,
      onChange,
      previous,
      next,
    }
  }
})
</script>

<style scoped>
</style>