<script setup lang="ts">
import {useFakerUtils} from '../../composables/useFakerUtils';
import {VehicleLogSettings} from '../../vite-env';

const settings = defineModel<VehicleLogSettings>({required: true});

const {createDriver} = useFakerUtils();

function addDriver() {
  const d1 = createDriver();

  settings.value.drivers.push(d1);
}

function deleteDriver(index: number) {
  const filteredList = settings.value.drivers.filter((_v, i) => i != index);

  settings.value.drivers = filteredList;
}
</script>

<template>
  <Fieldset legend="Vehicle Logbook - Drivers">
    <DataTable
      :value="settings.drivers"
      size="small"
      tableStyle="min-width: 30rem"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Drivers </span>
          <Button icon="pi pi-plus" rounded raised @click="addDriver()" />
        </div>
      </template>

      <Column
        :field="p => `${p.firstName} ${p.lastName}`"
        header="Name"
        style="min-width: 14rem; width: 70%"
      >
      </Column>
      <Column
        field="randWeight"
        header="Probability"
        style="width: 4rem"
      ></Column>
      <Column :exportable="false" style="width: 2rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteDriver(slotProps.index)"
          />
        </template>
      </Column>
    </DataTable>
  </Fieldset>
</template>
