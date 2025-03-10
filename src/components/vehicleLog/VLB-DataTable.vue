<script setup lang="ts">
import {
  DataTableCellEditCompleteEvent,
  DataTablePassThroughOptions,
  DataTableRowReorderEvent,
} from 'primevue';
import {VehicleLogEntry, VehicleLogSettings} from '../../vite-env';
import {computed, ref} from 'vue';
import {useFormatters} from '../../composables/useFormatters';
import {isDefined} from '@vueuse/core';

const data = defineModel<Array<VehicleLogEntry>>({
  required: true,
  default: [],
});

const settings = defineModel<VehicleLogSettings>('settings', {required: true});

const emit = defineEmits<{
  regenerateLogBook: [];
}>();

/* ===  === */

const dateRange = computed(() => {
  const date1 = data.value[0]?.dateTime ?? new Date();
  const date2 = data.value.at(-1)?.dateTime ?? new Date();
  const fmt = new Intl.DateTimeFormat('en', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
  });

  return fmt.formatRange(date1, date2);
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
  console.log('onFuelChanged %o', e.target);
  const elem = e.target;
  if (isDefined(elem)) {
    // (HTMLElement elem)
  }
};

function deleteEntry(index: number) {
  const filteredList = data.value.filter((_v, i) => i != index);

  data.value = filteredList;
  settings.value.numberOfRecords = filteredList.length
}

function addEntry() {
  settings.value.numberOfRecords++;
  data.value.push({
    key: `${settings.value.numberOfRecords}`,
    dateTime: new Date(),
    refueled: false,
    destinations: '',
    driver: ''
  })
}

const addEntryBtnDisabled= computed(() => settings.value.numberOfRecords === 21 || data.value.length === 21)

/* === Formatting === */

const {formatDateTime} = useFormatters();

/* === Pass Through === */

const dataTablePt = ref<DataTablePassThroughOptions>({
  table: {style: 'min-width: 50rem'},
  column: {
    bodycell: ({state}: Record<string, Record<string, string>>) => ({
      class: [{'py-0': state['d_editing']}],
    }),
  },
  header: {
    class: 'grid grid-cols-[max-content_1fr_max-content_max-content] gap-x-4',
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
    <template #header>
      <span class="text-lg">
        <span class="font-semibold text-nowrap">LogBook for Vehicle:</span>
        {{ settings.vehicle.description }} -
        {{ settings.vehicle.id }}
      </span>
      <span class="text-sm text-nowrap row-start-2">{{ dateRange }}</span>

      <Button
        icon="pi pi-plus"
        rounded
        raised
        size="small"
        label="New Row"
        severity="success"
        class="col-start-3"
        @click="addEntry()"
        :disabled="addEntryBtnDisabled"
      />
      <Button
        icon="pi pi-refresh"
        rounded
        raised
        size="small"
        label="Regenerate Table"
        @click="emit('regenerateLogBook')"
      />
    </template>

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
        <Checkbox
          v-model="data[field]"
          binary
          variant="filled"
          autofocus
          @change="onFuelChanged"
        />
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

    <Column :exportable="false" style="width: 2rem">
      <template #body="slotProps">
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          severity="danger"
          @click="deleteEntry(slotProps.index)"
        />
      </template>
    </Column>
  </DataTable>
</template>
