<template>
  <v-card flat height="100%" width="100%">
    <template v-if="!items || items.length < 1">
      <v-row class="flex-column" dense align="center" justify="center">
        <p class="disabled--text">No additional details.</p>
        <!-- <p class="mt-4">
          <v-btn text large color="primary">
            <v-icon color="primary">mdi-plus</v-icon>ADD
          </v-btn>
        </p>-->
      </v-row>
    </template>
    <template v-else>
      <v-row
        dense
        v-for="(field, key) in orderBy(items, 'name')"
        :key="key + 'cfrow'"
        align="center"
      >
        <v-col
          class="subheading primary--text font-weight-bold d-flex flex-grow-1"
        >
          {{ field.name }}
        </v-col>
        <v-col class="d-flex flex-grow-1 flex-shrink-1">{{
          field.value
        }}</v-col>
        <v-col class="d-flex flex-grow-0 flex-shrink-1">
          <v-tooltip color="primary" right>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on">
                {{ field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
            <span>
              {{
                field.internal === '1'
                  ? 'Internal use only'
                  : 'Visible to public'
              }}
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'
export default {
  name: 'ciCfList',
  props: {
    items: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>

<style></style>
