<template>
  <v-app>
    <v-app-bar color="primary" app dark clipped-right>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setView">
        <v-icon>{{
          view === 'Calendar' ? 'mdi-format-list-bulleted-type' : 'mdi-calendar'
        }}</v-icon>
      </v-btn>

      <!-- <v-btn icon>
        <v-icon>mdi-bookmark-plus-outline</v-icon>
      </v-btn>-->
       <!-- <template v-slot:extension>
          <v-toolbar-title>MENU</v-toolbar-title>
      <v-spacer></v-spacer>
       </template> -->
    </v-app-bar>
    <v-content>
      <component :is="view"></component>
      <!-- <Calendar></Calendar> -->
    </v-content>
    <v-footer color="primary" app dark clipped-right>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-settings-outline</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import Calendar from '@/components/calendar/Calendar';
import Catalog from '@/components/catalog/catalog';

export default {
  name: 'App',
  components: {
    Calendar,
    Catalog
  },
  data: () => ({
    title: 'EIPL RESERVATIONS',

    view: 'Calendar'
    //
  }),
  methods: {
    setView() {
      this.view = this.view === 'Calendar' ? 'Catalog' : 'Calendar';
      localStorage.setItem('lastView', this.view);
    }
  },
  created() {
    this.view = localStorage.getItem('lastView')
      ? localStorage.getItem('lastView')
      : 'Calendar';
    this.$store.dispatch('initializeApp', this.$apiSettings);
  }
};
</script>
