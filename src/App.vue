<template>
  <v-app>
    <v-app-bar color="primary" app dark clipped-right>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setView">
        <v-icon>
          {{
            viewMain === 'Calendar'
              ? 'mdi-format-list-bulleted-type'
              : 'mdi-calendar'
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
    <sideDrawer></sideDrawer>

    <v-content ref="content">
      <transition name="component-fade" appear mode="out-in">
        <component :is="viewMain" v-if="isLoaded" :key="viewMain"></component>
        <!-- <Calendar></Calendar> -->
      </transition>
    </v-content>
    <v-footer color="primary" app dark clipped-right>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn icon @click="viewMain = 'settings'">
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </v-footer>
    <Snackbar></Snackbar>
  </v-app>
</template>

<script>
import Snackbar from '@/components/global/snackbar'

export default {
  name: 'App',
  components: {
    calendar: () => import('@/components/calendar/Calendar'),
    catalog: () => import('@/components/catalog/catalog'),
    settings: () => import('@/views/settings'),
    sideDrawer: () => import('@/components/filterDrawer/FilterDrawer'),
    Snackbar
  },
  data: () => ({
    isLoaded: false,
    title: 'EIPL RESERVATIONS'
  }),
  computed: {
    viewMain: {
      get() {
        return this.$store.state.viewMain
      },
      set(v) {
        this.$store.dispatch('setStateValue', {
          key: 'viewMain',
          value: v
        })
      }
    }
  },
  methods: {
    setDimmensions() {
      // let contentLocal = this.$refs.content.$el.offsetHeight
      let contentState = this.$store.state.content
      contentState.main.x = this.$refs.content.$el.offsetWidth
      contentState.main.y = this.$refs.content.$el.offsetHeight
      this.$store.dispatch('setStateValue', {
        key: 'content',
        value: contentState
      })
      this.isLoaded = true
    },
    setView() {
      this.viewMain = this.viewMain === 'catalog' ? 'calendar' : 'catalog'
      localStorage.setItem('lastView', this.viewMain)
    }
  },
  created() {
    this.viewMain = localStorage.getItem('lastView') || 'calendar'
    this.$store.dispatch('initializeApp', this.$apiSettings)
  },
  mounted() {
    setTimeout(() => {
      this.setDimmensions()
    }, 1500)
  }
}
</script>
<style>
body::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: #623fa7;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(102, 102, 102, 0.26);
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
