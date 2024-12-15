<script setup lang="ts">
import {ref} from 'vue';

const mainMenu = ref([
  {
    label: 'Props',
    items: [
      {
        label: 'Medical Incident Report',
      },
      {
        label: 'Vehicle Log',
        route: {name: '/vehicle-log'},
      },
    ],
  },
]);
</script>

<template>
  <!-- 
  <AppLayout />

   -->

  <div class="appWrapper">
    <Card
      class="appNav bg-gradient-to-b from-stone-300 from-50% to-cyan-700 to-80%"
    >
      <template #header>
        <span class="inline-flex items-center gap-1 px-2 py-2">
          <img
            alt="Vue logo"
            class="logo"
            src="@/assets/vue.svg"
            width="32"
            height="32"
          />
          <span class="text-xl font-semibold"
            >RPG Prop<span class="text-primary text-sky-700">Maker</span></span
          >
        </span>
      </template>
      <template #content>
        <Menu :model="mainMenu" class="bg-transparent border-0">
          <template #submenulabel="{item}">
            <span class="text-primary text-sky-700 font-bold">{{
              item.label
            }}</span>
          </template>
          <template #item="{item, props}">
            <router-link
              v-if="item.route"
              v-slot="{href, navigate}"
              :to="item.route"
              custom
            >
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </Menu>
      </template>
    </Card>

    <div class="appContent">
      <router-view></router-view>
    </div>
  </div>

  <Toast />
</template>

<style scoped>
.appWrapper {
  display: grid;
  grid-template-columns: min-content 1fr 8px;
  grid-template-rows: 4px 1fr 16px 8px;
  gap: 8px;
  grid-template-areas:
    '. . .'
    'appNav appContent .'
    'appNav . .'
    '. . .';

  height: 100vh;
}

.appNav {
  grid-area: appNav;
  --p-card-border-radius: 0 12px 12px 0;
}

.appNav:deep(.p-card-body) {
  padding: 4px;
}
.appContent {
  grid-area: appContent;
}

.appFooter {
  grid-area: appFooter;
  align-self: start;
}
</style>
