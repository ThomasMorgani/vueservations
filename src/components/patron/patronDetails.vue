<template>
  <v-card>
    <v-card-title class="headline primary--text justify-center"
      >EDIT PATRON</v-card-title
    >
    <v-card-text style="max-height: 600px;">
      <v-form ref="form">
        <v-row align="center" justify="space-around">
          <v-col cols="5"
            ><v-text-field
              v-model="first_name"
              label="First Name"
              required
              prepend-icon="mdi-account"
              hint="(required)"
              persistent-hint
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="last_name"
              label="Last Name"
              required
              prepend-icon="mdi-account"
              hint="(required)"
              persistent-hint
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="email"
              label="Email"
              required
              prepend-icon="mdi-email"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="phone"
              label="Telephone"
              required
              prepend-icon="mdi-phone"
              mask="###-###-####"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="barcode"
              label="Barcode"
              required
              prepend-icon="mdi-barcode"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-textarea
              v-model="notes"
              label="Notes"
              dense
              rows="2"
              clearable
              prepend-icon="mdi-note"
            ></v-textarea
          ></v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" disabled>RESET</v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
      <v-btn text color="primary" @click="savePatron" :disabled="!valid"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'patronDetails',
  data: () => ({
    barcode: null,
    email: null,
    first_name: null,
    last_name: null,
    notes: null,
    phone: null
  }),
  computed: {
    valid() {
      return this.first_name && this.last_name
    }
  },
  methods: {
    savePatron() {
      console.log('save patron method')
      this.$store
        .dispatch('apiCall', {
          endpoint: '/patron_add',
          postData: {
            barcode: this.barcode,
            first_name: this.first_name,
            last_name: this.last_name,
            phone: this.phone
          }
        })
        .then(res => {
          if (res.status) {
            if (res.status === 'success') {
              //dispatch snackbar
              this.$store.dispatch('setStateValue', {
                key: 'snackbarData',
                value: { status: res.status, message: res.message }
              })
              this.$store.dispatch('setStateValue', {
                key: 'snackbarState',
                value: true
              })
              this.$store.dispatch('setStateValue', {
                isPush: true,
                key: 'patrons',
                value: res.data
              })
              this.$emit('patronAdded', res.data)
              //TODO: START HERE, SET PATRON AS SELECTED PATRON
              //CLOSE MODAL
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style></style>
