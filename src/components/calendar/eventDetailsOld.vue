<template>
  <v-card width="800">
    <v-card-title class="title primary--text justify-center">
      <h4>EVENT DETAILS</h4>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <ciDetails
            :expandDetails="false"
            :item="event.eventData.ciData"
            :withCardActions="false"
          ></ciDetails>
        </v-col>
        <v-col cols="12">
          <patronDetails
            :expandDetails="false"
            :patron="event.eventData.patronData"
            :withCardActions="false"
          ></patronDetails>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ciDetails from '@/components/catalog/catalogItem/ciDetails'
import patronDetails from '@/components/patron/patronDetails'
export default {
  name: 'eventDetails',
  components: {
    ciDetails,
    patronDetails
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.event)
  }
}
</script>

<style></style>
