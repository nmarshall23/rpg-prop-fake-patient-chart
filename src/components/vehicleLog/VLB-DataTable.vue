<script setup lang="ts">
import {
  DataTableCellEditCompleteEvent,
  DataTablePassThroughOptions,
  DataTableRowReorderEvent,
} from 'primevue';
import {VehicleLogEntry} from '../../vite-env';
import {ref} from 'vue';
import {useFormatters} from '../../composables/useFormatters';
import { isDefined } from '@vueuse/core';

const data = defineModel<Array<VehicleLogEntry>>({
  required: true,
  default: [],
});

/* === Table Functions === */

const onCellEditComplete = (event: DataTableCellEditCompleteEvent) => {
  let {data, newValue, field} = event;

  console.log('onCellEditComplete %o', event);
  switch (field) {
    case 'dateTime':
    case 'refueled':
      data[field] = newValue;
      break;
    default:
      if (newValue.trim().length > 0) data[field] = newValue;
      // else event.preventDefault();
      break;
  }
};

const onRowReorder = (event: DataTableRowReorderEvent) => {
  data.value = event.value;
};

const onFuelChanged = (e: Event) => {
  console.log('onFuelChanged %o', e.target)
  const elem = e.target
  if (isDefined(elem)) {
    // (HTMLElement elem)
    
  }
}

/* === Formatting === */

const {formatDateTime} = useFormatters();

/* === Pass Through === */

const dataTablePt = ref<DataTablePassThroughOptions>({
  table: {style: 'min-width: 50rem'},
  column: {
    bodycell: ({state}) => ({
      class: [{'py-0': state['d_editing']}],
    }),
  },
});
</script>

<template>
  <DataTable
    :value="data"
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    @rowReorder="onRowReorder"
    tableStyle="min-width: 50rem"
    :pt="dataTablePt"
  >
    <Column rowReorder headerStyle="width: 3rem" />

    <Column field="dateTime" header="Date / Time" style="width: 15rem">
      <template #body="{data, field}">
        {{ formatDateTime(data[field]) }}
      </template>
      <template #editor="{data, field}">
        <DatePicker v-model="data[field]" showTime hourFormat="24" autofocus />
      </template>
    </Column>

    <Column field="refueled" header="Refueled" style="width: 2rem">
      <template #body="slotProps">
        <Tag
          v-if="slotProps.data.refueled"
          icon="pi pi-check"
          severity="success"
          rounded
        />
      </template>
      <template #editor="{data, field}">
        <Checkbox v-model="data[field]" binary variant="filled" autofocus @change="onFuelChanged"/>
      </template>
    </Column>

    <Column field="destinations" header="Destinations" style="width: 50%">
      <template #editor="{data, field}">
        <InputText v-model="data[field]" autofocus fluid />
      </template>
    </Column>

    <Column field="driver" header="Driver">
      <template #editor="{data, field}">
        <InputText v-model="data[field]" autofocus />
      </template>
    </Column>
  </DataTable>
</template>
