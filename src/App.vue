<template>
  <v-app>
    <v-app-bar color="primary" app dark clipped-right>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setView">
        <v-icon>
          {{
          view === 'Calendar' ? 'mdi-format-list-bulleted-type' : 'mdi-calendar'
          }}
        </v-icon>
      </v-btn>

      <!-- <v-btn icon>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>-->
      <!-- <template v-slot:extension>
          <v-toolbar-title>MENU</v-toolbar-title>
      <v-spacer></v-spacer>
      </template>-->
    </v-app-bar>
    <v-content ref="content">
      <component :is="view" v-if="isLoaded"></component>
      <!-- <Calendar></Calendar> -->
    </v-content>
    <v-footer color="primary" app dark clipped-right>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn icon @click="view = 'settings'">
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </v-footer>
    <Snackbar></Snackbar>
  </v-app>
</template>

<script>
import Calendar from '@/components/calendar/Calendar'
import Catalog from '@/components/catalog/catalog'
import Snackbar from '@/components/global/snackbar'

export default {
  name: 'App',
  components: {
    Calendar,
    Catalog,
    settings: () => import('@/views/settings'),
    Snackbar
  },
  data: () => ({
    isLoaded: false,
    title: 'EIPL RESERVATIONS',
    view: 'Calendar'
    //
  }),
  methods: {
    setDimmensions() {
    console.log(this.$refs.content.$el)
    console.log(this.$store.state)
    let contentLocal = this.$refs.content.$el.offsetHeight
    let contentState = this.$store.state.content
    contentState.main.x = this.$refs.content.$el.offsetWidth
    contentState.main.y = this.$refs.content.$el.offsetHeight
    console.log(contentLocal)
    console.log(contentState)
    // console.log(content.offsetHeight)
    // console.log(content.offsetWidth)
    this.$store.dispatch('setStateValue', {key: 'content', value: contentState })
    this.isLoaded = true

    },
    setView() {
      this.view = this.view === 'Calendar' ? 'Catalog' : 'Calendar'
      localStorage.setItem('lastView', this.view)
    }
  },
  created() {
    this.view = localStorage.getItem('lastView')
      ? localStorage.getItem('lastView')
      : 'Calendar'
    this.$store.dispatch('initializeApp', this.$apiSettings)
  },
  mounted() {
    setTimeout(() => {
      this.setDimmensions()
    }, 1500);

  }
}
</script>
<style>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background: #623fa7;
}

::-webkit-scrollbar-track {
  background: rgba(102, 102, 102, 0.26);
}
</style>