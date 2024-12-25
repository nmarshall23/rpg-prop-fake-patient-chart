<script setup lang="ts">
import {VehicleLogSettings} from '../../vite-env';
import {useFakerUtils} from '../../composables/useFakerUtils';

const settings = defineModel<VehicleLogSettings>({required: true});

const {createStreetAddress} = useFakerUtils();

function addDest() {
  const c = createStreetAddress();
  settings.value.destinations.push(c);
}

function deleteDest(index: number) {
  const filteredList = settings.value.destinations.filter(
    (_v, i) => i != index,
  );

  settings.value.destinations = filteredList;
}
</script>

<template>
  <Fieldset legend="Vehicle Logbook - Destinations">
    <DataTable
      :value="settings.destinations"
      size="small"
      tableStyle="min-width: 30rem"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Destinations </span>
          <Button icon="pi pi-plus" rounded raised @click="addDest()" />
        </div>
      </template>

      <Column :field="p => `${p.name}`" header="Name" style="width: 70%">
      </Column>

      <Column
        field="randWeight"
        header="Probability"
        style="width: 4rem"
      ></Column>
      <Column :exportable="false" style="min-width: 2rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteDest(slotProps.index)"
          />
        </template>
      </Column>
    </DataTable>
  </Fieldset>
</template>
