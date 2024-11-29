<script setup lang="ts">
import {ref, onBeforeMount} from 'vue';
import {useFakeCharts} from '@/composables/fakeCharts';

const { getPatientCharts} = useFakeCharts()

const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);


onBeforeMount(() => {
    treeTableValue.value = getPatientCharts()
})

</script>

<template>
  <ni-card>
    <template #header> Patients </template>
    <TreeTable
      :value="treeTableValue"
      selectionMode="checkbox"
      v-model:selectionKeys="selectedTreeTableValue"
    >
      <Column field="name" header="Name" :expander="true"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="age" header="Age"></Column>
    </TreeTable>
  </ni-card>
</template>
