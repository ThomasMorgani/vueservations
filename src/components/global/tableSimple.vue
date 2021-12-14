<template>
  <v-simple-table dense fixed-header :height="height" class="mt-4">
    <template v-slot:default>
      <thead>
        <tr>
          <th
            v-for="h in headers"
            :key="h.text"
            :class="h.class ? h.class : 'text-left'"
          >
            {{ h.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(i, ii) in items" :key="'tr' + ii">
          <td v-for="(h, hi) in headers" :key="'td' + ii + hi">
            {{ i[h.value] }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'tableSimple',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    height: {
      required: false,
      default: null
    }
  }
}
</script>

<style></style>
