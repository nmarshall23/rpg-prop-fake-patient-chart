<script setup lang="ts">
import {ref, onBeforeMount} from 'vue';
import {useFakeCharts} from '@/composables/fakeCharts';
import {useFakeChartsPdf} from '@/composables/fakeChartsPdf';

const {getPatientCharts} = useFakeCharts();

const treeTableValue = ref(null);

onBeforeMount(() => {
  treeTableValue.value = getPatientCharts();
});

async function downloadPDF() {
  const content = await useFakeChartsPdf();
  const fileName = 'Doc.pdf';

  // const linkSource = `data:application/pdf;base64,${content}`;
  const downloadLink = document.createElement('a');
  // document.body.appendChild(downloadLink);

  downloadLink.href = content;
  downloadLink.target = '_self';
  downloadLink.download = fileName;
  downloadLink.click();
}

const showChartConfig = ref(false);

const products = ref();
const expandedRows = ref({});
</script>

<template>
  <panel class="shadow-sm">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="text-xl">Fake Patient Charts</span>
      </div>
    </template>

    <template #icons>
      <Button
        icon="pi pi-cog"
        severity="secondary"
        rounded
        text
        @click="showChartConfig = true"
      />
    </template>

    <DataTable v-model:expandedRows="expandedRows" :value="treeTableValue" dataKey="id"
         tableStyle="min-width: 60rem">
    
    <Column expander style="width: 5rem" />
    <Column field="name" header="Name"></Column>
 
    <Column field="price" header="Price">
        <template #body="slotProps">
            
        </template>
    </Column>
    <Column field="category" header="Category"></Column>
    <Column field="rating" header="Reviews">
        <template #body="slotProps">
            <Rating :modelValue="slotProps.data.rating" readonly />
        </template>
    </Column>
    <Column header="Status">
        <template #body="slotProps">
            <Tag :value="slotProps.data.inventoryStatus"  />
        </template>
    </Column>
    <template #expansion="slotProps">
        
    </template>
</DataTable>
    
    <!-- <TreeTable
      :value="treeTableValue"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 15, 30]"
    >
      <Column field="name" header="Name" expander style="width: 34%"></Column>

      <Column field="gender" header="Gender"></Column>
      <Column field="age" header="Age"></Column>

      <template #paginatorstart>
        <Button
          icon="pi pi-download"
          severity="secondary"
          rounded
          text
          label="Download Charts"
          @click="downloadPDF"
        />
      </template>
    </TreeTable> -->
    <Drawer
      v-model:visible="showChartConfig"
      header="Bottom Drawer"
      position="bottom"
      style="height: auto"
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </Drawer>
  </panel>
</template>
