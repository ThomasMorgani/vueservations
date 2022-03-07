<template>
  <v-sheet
    color="transparent"
    height="100%"
    width="100%"
    class="d-flex  align-center  justify-center"
  >
    <v-card text type="info" width="400">
      <v-card-title
        class="text-h5 font-weight-bold primary--text align-center justify-center text-center"
        >DEMO</v-card-title
      >
      <v-card-text
        class="d-flex flex-column align-center justify-center primary--text font-weight-bold text-center"
      >
        <p>
          This is a demo for the desktop version of the Vueservations App.
        </p>
        <p>
          Some features may be unavailable and any changes made to content
          persists only on this local device.
        </p>
        <p>
          To get or contribute checkout:
          <a
            href="https://github.com/ThomasMorgani/vueservation/tree/demo"
            target="blank"
            class=""
          >
            <v-icon color="primary" small class="mb-1 mr-1">mdi-github</v-icon
            >GITHUB</a
          >
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" :to="{ name: 'Calendar' }">
          <v-icon left> mdi-calendar-cursor</v-icon>GET STARTED
        </v-btn></v-card-actions
      >
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  mounted() {
    //demo
    //router: if first load, redirect here
    localStorage.setItem('firstLoad', false)
  }
}
</script>

<style lang="scss" scoped></style>
