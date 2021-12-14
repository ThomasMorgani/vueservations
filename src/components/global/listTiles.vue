<template>
  <v-list two-line>
    <v-list-item-group v-model="selected">
      <template v-for="(item, index) in items">
        <v-list-item :key="item.name">
          <template v-slot:default="{ active, toggle }">
            <v-list-item-avatar size="45">
              <img
                src="https://www.eipl.org/reservations/images/uploads/458d8cab268259a7e676eadc42ec2c6d.gif"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.name + ' ' + index"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="item.category"
              ></v-list-item-subtitle>
              <v-list-item-subtitle v-text="'hello'"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text
                v-text="item.action"
              ></v-list-item-action-text>
              <v-icon v-if="!active" color="grey lighten-1">
                mdi-checkbox-blank-outline
              </v-icon>

              <v-icon v-else color="primary">
                mdi-checkbox-marked
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider :key="item.name + 'dv'"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    selected: null
  })
}
</script>

<style></style>
