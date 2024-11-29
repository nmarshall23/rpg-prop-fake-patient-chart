<script lang="ts" setup>
import {useLayout} from '@/composables/layout.ts';

const {onMenuToggle} = useLayout();
</script>

<template>
  <div class="layout-topbar border-b">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        @click="onMenuToggle"
      >
        <i class="pi pi-bars"></i>
      </button>
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/vue.svg"
        width="32"
        height="32"
      />
      <span>RPG Prop Maker - Patient Chart</span>
    </div>
    <div class="layout-topbar-actions"></div>
  </div>
</template>
