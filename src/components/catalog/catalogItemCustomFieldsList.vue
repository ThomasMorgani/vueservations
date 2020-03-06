<template>
  <v-card flat width="100%">
    <template v-if="!items">
      <v-row class="flex-column" dense align="center">
        <p>No additional details.</p>
        <p>Click the "edit" icon above to modify custom fields.</p>
      </v-row>
    </template>
    <template v-else>
      <v-row dense v-for="(field, key) in items" :key="key + 'cfrow'" align="center">
        <v-col class="subheading primary--text font-weight-bold d-flex flex-grow-1">
          {{
          field.name
          }}
        </v-col>
        <v-col class="d-flex flex-grow-1 flex-shrink-1">{{ field.value }}</v-col>
        <v-col class="d-flex flex-grow-0 flex-shrink-1">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on">
                {{
                field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye'
                }}
              </v-icon>
            </template>
            <span>
              {{
              field.internal === '1' ? 'Internal use only' : 'Visible to public'
              }}
            </span>
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
      required: false,
      default: () => []
    }
  }
}
</script>

<style></style>
