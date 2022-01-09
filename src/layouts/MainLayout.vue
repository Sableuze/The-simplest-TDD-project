<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container class="q-pa-lg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

@Component({
})
export default class MainLayout extends Vue {
}
</script>
