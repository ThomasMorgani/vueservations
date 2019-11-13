<template>
  <v-app>
    <FilterDrawer :value="navDrawer"></FilterDrawer>
    <v-app-bar color="primary" app dark clipped-right>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-format-list-bulleted-type</v-icon>
      </v-btn>
      <v-btn icon @click="navDrawer = !navDrawer">
        <v-icon>{{navDrawer ? 'mdi-filter-remove' : 'mdi-filter'}}</v-icon>
      </v-btn>
      <!-- <v-btn icon>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>-->
    </v-app-bar>
    <v-content>
      <Calendar></Calendar>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from '@/components/Calendar'
import FilterDrawer from '@/components/FilterDrawer'

export default {
  name: 'App',
  components: {
    Calendar,
    FilterDrawer
  },
  data: () => ({
    title: 'EIPL RESERVATIONS',
    navDrawer: false
    //
  }),
};
</script>
