<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="eva-menu-outline" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title class="non-selectable">
          {{ $t('layout.title') }}
        </q-toolbar-title>

        <div class="q-pr-md non-selectable">Quasar v{{ $q.version }}</div>

        <q-btn dense flat round icon="eva-list-outline" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" show-if-above bordered :width="200" :breakpoint="500">
      <GlobalMenu />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalMenu from 'components/GlobalMenu.vue';

defineOptions({
  name: 'MainLayout'
});

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

</script>
