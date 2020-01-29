<template>
  <v-card class="mt-4">
    <v-card-title class="title primary--text">
      NEW SETTING
    </v-card-title>
    <v-card-text>
      <v-text-field filled label="Name" v-model="setting_name"></v-text-field>
      <v-text-field filled label="Value" v-model="setting_value"></v-text-field>
      <v-text-field
        filled
        label="Default Value"
        v-model="setting_default"
      ></v-text-field>
      <v-text-field
        filled
        label="Desciption"
        v-model="setting_description"
      ></v-text-field>
      <v-btn color="success" @click="saveSetting" class="self-right"
        >SAVE</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'newSettingCard',
  data: () => ({
    saveLoading: null,
    setting_name: null,
    setting_value: null,
    setting_default: null,
    setting_description: null
  }),
  methods: {
    resetForm() {
      this.setting_name = null
      this.setting_value = null
      this.setting_default = null
      this.setting_description = null
    },
    saveSetting() {
      this.$store
        .dispatch('settingsNew', {
          name: this.setting_name,
          setting: this.setting_value,
          default_value: this.setting_default,
          description: this.setting_description
        })
        .then(resp => {
          console.log(resp)
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style></style>
