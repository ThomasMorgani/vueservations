<template>
  <v-card height="100%">
    <v-card-title
      class="title primary--text font-weight-bold d-flex align-center pb-0"
    >
      SETTINGS
      <v-spacer></v-spacer>
      <BtnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ disabled: true, icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-puzzle-plus' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add Setting'"
        @click="settingAdd"
      ></BtnWithTooltip>
    </v-card-title>

    <v-card-text
      class="pt-0"
      v-if="currentSettings && Object.keys(currentSettings).length > 0"
    >

<v-row justify="center">
<v-col cols="12" md="10" lg="9"> 
  
      <!-- <newSetting></newSetting> -->
      <Setting
        :setting="currentSettings.Default_reservation_buffer"
        :currentValue="currentSettings.Default_reservation_buffer.currentValue"
        class="mt-4"
        @saveSetting="settingSave"
        @updateSetting="settingUpdate"
      >
        <v-text-field
          :value="currentSettings.Default_reservation_buffer.currentValue"
          min="0"
          type="number"
          @input="
            settingUpdate({
              setting: 'Default_reservation_buffer',
              value: $event
            })
          "
        ></v-text-field>
      </Setting>
      <Setting
        :setting="currentSettings.Default_reservation_length"
        class="mt-4"
        @saveSetting="settingSave"
        @updateSetting="settingUpdate"
      >
        <v-text-field
          v-model="currentSettings.Default_reservation_length.currentValue"
          min="0"
          type="number"
          @input="
            settingUpdate({
              setting: 'Default_reservation_length',
              value: $event
            })
          "
        ></v-text-field>
      </Setting>
  
</v-col>

</v-row>

    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Setting from '@/components/management/Setting'
// import newSetting from '@/components/management/newSetting'

export default {
  name: 'Settings',
  components: {
    Setting
    // newSetting
  },
  data: () => ({
    currentSettings: {},
    isLoading: true
  }),
  computed: {
    ...mapState({
      settings: state => state.appSettings
    }),
    settingsByName() {
      const settings = {}
      this.settings.forEach(setting => {
        settings[setting.name] = setting
        settings[setting.name].currentValue = setting.setting
      })
      return settings
    }
  },
  methods: {
    settingAdd() {
      console.log('settingAdd')
    },
    settingSave(settingName) {
      const setting = { ...this.currentSettings[settingName] }
      setting.setting = setting.currentValue
      delete setting.currentValue

      // this.currentSettings[settingName].setting = setting.setting
      const settings = Object.values(this.currentSettings).map(setting => {
        setting.setting = setting.currentValue
        delete setting.currentValue
        return setting
      })
      this.$store.dispatch('setStateValue', {
        key: 'appSettings',
        value: [...settings]
      })

      this.$store.dispatch('localStorageWrite', {
        key: `appSettings`,
        data: [...this.settings]
      })
      this.$store.dispatch('toggleSnackbar', {
        status: 'success',
        message: 'Setting saved.'
      })
      this.currentSettings = { ...this.settingsByName }
    },
    settingUpdate({ setting, value }) {
      this.currentSettings = {
        ...this.currentSettings,
        [setting]: {
          ...this.currentSettings[setting],
          currentValue: value
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.currentSettings = { ...this.settingsByName }
      this.isLoading = false
    }, 1200)
  }
}
</script>

<style></style>
