<template>
  <v-app>
    <titlebarApp></titlebarApp>
    <filterDrawer></filterDrawer>
    <v-main ref="content" v-resize="setDimmensions">
      <template v-if="isLoaded">
        <transition name="component-fade" appear mode="out-in">
          <router-view :key="$route.name"> </router-view>
        </transition>
      </template>
    </v-main>
    <footerApp></footerApp>
    <Snackbar :key="$store.state.snackbarState"></Snackbar>
  </v-app>
</template>

<script>
import Snackbar from '@/components/global/snackbar'
import footerApp from '@/components/global/footer'
import titlebarApp from '@/components/global/titlebar'

export default {
  name: 'App',
  components: {
    footerApp,
    filterDrawer: () => import('@/components/filterDrawer/FilterDrawer'),
    Snackbar,
    titlebarApp
  },
  data: () => ({
    isLoaded: false
  }),
  computed: {
    viewSub: {
      get() {
        return this.$store.state.viewSub
      },
      set(v) {
        this.$store.dispatch('setStateValue', {
          key: 'viewSub',
          value: v
        })
      }
    }
  },
  methods: {
    setDimmensions() {
      // let contentLocal = this.$refs.content.$el.offsetHeight
      let contentState = { ...this.$store.state.content }
      contentState.main.x = this.$refs.content.$el.offsetWidth
      contentState.main.y = this.$refs.content.$el.offsetHeight
      this.$store.dispatch('setStateValue', {
        key: 'content',
        value: contentState
      })
    }
  },
  async created() {
    // const lastRoute = localStorage.getItem('lastRoute') || 'calendar'
    // if (lastRoute && lastRoute !== this.$route.name)
    //   this.$router.push({ name: lastRoute })
    await this.$store.dispatch('appInitialize')
    this.setDimmensions()
    this.isLoaded = true
  }
}
</script>
<style>
html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

.hoverPointer:hover {
  cursor: pointer;
}

.mainView::-webkit-scrollbar {
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
  background: rgba(102, 102, 102, 0);
  border-radius: 10px;
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
