<template>
  <v-card flat width="100%">
    <template v-for="(field, key) in items">
      <v-row dense :key="key + 'cfrow'" align="center">
        <v-col class="subheading primary--text font-weight-bold">{{
          field.name
        }}</v-col>
        <v-col>{{ field.value }}</v-col>
        <v-col>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on">{{
                field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye'
              }}</v-icon>
            </template>
            <span>{{
              field.internal === '1' ? 'Internal use only' : 'Visible to public'
            }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'ciCfList',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>
