<template>
  <v-card height="100%">
    <v-card-title
      class="title primary--text font-weight-bold d-flex align-center pb-0"
    >
      SETTINGS
      <v-spacer></v-spacer>
      <btnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ disabled: true, icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-puzzle-plus' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add Setting'"
        @click="settingAdd"
      ></btnWithTooltip>
    </v-card-title>

    <v-card-text
      class="pt-0"
      v-if="currentSettings && Object.keys(currentSettings).length > 0"
    >
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import Setting from '@/components/management/Setting'
// import newSetting from '@/components/management/newSetting'

export default {
  name: 'Settings',
  components: {
    btnWithTooltip,
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

      this.$store
        .dispatch('apiPost', {
          endpoint: '/settings_update',
          postData: { data: setting }
        })
        .then(resp => {
          if (resp?.status === 'success') {
            this.currentSettings[settingName].setting = setting.setting
            const settings = Object.values(this.currentSettings).map(
              setting => {
                delete setting.currentValue
                return setting
              }
            )
            this.$store.dispatch('setStateValue', {
              key: 'settings',
              value: [...settings]
            })
            this.currentSettings = { ...this.settingsByName }
          }
        })
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
