<template>
  <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
    <q-list padding>
      <q-item-label header class="non-selectable">
        {{ $t('layout.menu.title') }}
      </q-item-label>

      <q-item clickable :active="$route.name?.toString().startsWith('board')" to="/" active-class="text-bold">
        <q-item-section avatar>
          <q-icon name="eva-hash-outline" />
        </q-item-section>

        <q-item-section>
          {{ $t('layout.menu.board') }}
        </q-item-section>
      </q-item>

      <q-item clickable :active="$route.name == 'settings'" to="/settings" active-class="text-bold">
        <q-item-section avatar>
          <q-icon name="eva-settings-2-outline" />
        </q-item-section>

        <q-item-section>
          {{ $t('layout.menu.settings') }}
        </q-item-section>
      </q-item>

      <q-item clickable :active="$route.name == 'about'" to="/about" active-class="text-bold">
        <q-item-section avatar>
          <q-icon name="eva-info-outline" />
        </q-item-section>

        <q-item-section>
          {{ $t('layout.menu.about') }}
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>{{ $t('layout.menu.darkmode') }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle :model-value="$q.dark.isActive" @update:model-value="v => ($q.dark.set(v))" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          Current Route: {{ $route.name }}
          <br />
          Params: {{ $route.params }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>
