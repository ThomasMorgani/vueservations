<template>
  <v-card>
    <modal-title text="COLOR SELECT"> </modal-title>
    <v-card-text>
      <v-select
        v-model="selection"
        color="primary"
        :items="predefined"
        label="Predefined colors"
      >
        <template #selection="{item}">
          <span class="text-capitalize">
            {{ item }}
          </span>
        </template>
        <template #item="{item, attrs, on}">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-avatar v-if="item === 'custom'">
              <v-avatar class="customGradient"></v-avatar>
            </v-list-item-avatar>
            <v-list-item-avatar v-else>
              <v-avatar :color="theme.light[item]"> </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content class="text-h6 text-capitalize">{{
              item
            }}</v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-color-picker
        v-model="pickerColor"
        mode="hexa"
        show-swatches
        class="ma-2"
      ></v-color-picker>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" text @click="$emit('cancel')">CANCEL</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" text @click="$emit('save')">SAVE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// import colors from 'vuetify/lib/util/colors'
export default {
  name: 'ColorPicker',
  props: {
    color: {
      type: String,
      default: null
    }
  },
  data: () => ({
    modal: false,
    picker: '',
    predefined: ['primary', 'secondary', 'accent', 'background', 'custom'],
    select: null
  }),
  computed: {
    pickerColor: {
      get() {
        return this.picker
      },
      set(v) {
        this.picker = v
        const themeColor = this.themeLabelFromHex(v)
        if (themeColor) {
          this.select = themeColor
          this.$emit('input', v)
        } else {
          this.select = 'custom'
          this.$emit('input', v)
        }
      }
    },
    selection: {
      get() {
        return this.select
      },
      set(v) {
        this.select = v
        if (this.select !== 'custom') {
          const themes = this.$vuetify.theme.themes
          // temp only light colors for now
          // this.$emit('input', v)
          // this.picker = this.$vuetify.theme.isDark ? themes.dark[v] : themes.light[v]
          this.picker = themes.light[v]
          this.$emit('input', this.picker)
        }
      }
    },
    textColor() {
      // attribution
      // https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.html
      const color = this.picker || ''
      if (typeof color !== 'string' || color?.substr(0, 1) !== '#') {
        return 'black'
      }
      const R = parseInt(color.substr(1, 2), 16)
      const G = parseInt(color.substr(3, 2), 16)
      const B = parseInt(color.substr(5, 2), 16)
      const hsp = Math.sqrt(R * R * 0.241 + G * G * 0.691 + B * B * 0.068)
      return hsp > 127.5 ? 'black' : 'white'
    },
    theme() {
      return this.$vuetify.theme.themes
    }
  },
  methods: {
    themeLabelFromHex(hex = '') {
      if (typeof hex === 'string' && hex.substr(0, 1) !== '#') return false
      //for now only showing light theme colors in predefined list
      for (let label in this.theme.light) {
        if (this.theme.light[label].toLowerCase() === hex.toLowerCase())
          return label
      }
      return false
    },
    isThemeLabel(color) {
      return this.predefined.indexOf(color) > -1
    }
  },
  created() {
    const color = this.color
    if (this.isThemeLabel(color)) {
      this.select = color
      this.picker = this.$vuetify.theme.themes.light[color]
    } else {
      const predefined = this.themeLabelFromHex(color)
      this.picker = color
      this.select = predefined || 'custom'
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn::before {
  background-color: transparent;
}

.customGradient {
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
}
</style>
