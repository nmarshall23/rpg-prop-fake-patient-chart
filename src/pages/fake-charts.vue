<script setup lang="ts">
import {ref, onBeforeMount} from 'vue';
import {useFakeCharts} from '@/composables/fakeCharts';
import {useFakeChartsPdf} from '@/composables/fakeChartsPdf';

const {getPatientCharts} = useFakeCharts();

const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);

onBeforeMount(() => {
  treeTableValue.value = getPatientCharts();
});

async function downloadPDF() {
  const content = await useFakeChartsPdf();
  const fileName = "Doc.pdf"

  // const linkSource = `data:application/pdf;base64,${content}`;
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);

  downloadLink.href = content;
  downloadLink.target = '_self';
  downloadLink.download = fileName;
  downloadLink.click();
}
</script>

<template>
  <panel class="shadow-sm">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="text-xl">Fake Patient Charts</span>
      </div>
    </template>

    <template #icons>
      <Button icon="pi pi-cog" severity="secondary" rounded text />
    </template>
    <TreeTable
      :value="treeTableValue"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 15, 30]"
    >
      <Column field="name" header="Name" expander style="width: 34%"></Column>

      <Column field="gender" header="Gender"></Column>
      <Column field="age" header="Age"></Column>

      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text />
        <Button
          icon="pi pi-download"
          severity="secondary"
          rounded
          text
          label="Download Charts"
          @click="downloadPDF"
        />
      </template>
    </TreeTable>
  </panel>
</template>
