<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {
  rand,
  randBetweenDate,
  randBoolean,
  randFullName,
  randNumber,
  randRecentDate,
  randSequence,
  randVehicle,
} from '@ngneat/falso';
import {useToggle} from '@vueuse/core';
import {useDownloadPDF} from '../composables/downloadPDF';
import {PDFForm} from 'pdf-lib';
import {useFillPdf} from '../composables/useFillPdf';
import type {VehicleLogEntry, VehicleLogSettings} from '../vite-env.d.ts';
import VehicleLogSettingsDrawer from '../components/vehicleLog/vehicleLogSettingsDrawer.vue';
import { faker } from '@faker-js/faker';

// === PAGE REFs === //
const vehicleLogSettings = ref<VehicleLogSettings>({
  numberOfRecords: 10,
  date: {
    maxDailyTrips: 5,
    minDailyTrips: 1,
    dailyTrips: [1, 2],
    range: [randRecentDate({days: 10}), new Date()],
    includeWeekends: false,
  },
  time: {
    start: new Date(),
    end: new Date(),
  },
  drivers: [],
  vehicle: {
    description: '',
    id: '',
  },
});

const vehicleLogTable = ref<Array<VehicleLogEntry>>([]);
const [isVisibleConfig, toggleConfigVisible] = useToggle();

/* === PAGE LIFECYCLE === */

onMounted(() => {
  genLogBookPage();
});

/* === RandGenFunc === */

const weightedDrivers = computed(() => {
  return vehicleLogSettings.value.drivers.map((v) => ({ weight: v.randWeight, value: `${v.firstName} ${v.lastName}`}))
})

function genRandVehicleLogEntry(value: number): VehicleLogEntry {
  return {
    key: `${value}`,
    dateTime: randBetweenDate({
      from: vehicleLogSettings.value.date.range[0],
      to: vehicleLogSettings.value.date.range[1],
    }),

    refueled: randBoolean(),
    destinations: rand(['THis', 'That', 'There']),
    driver: faker.helpers.weightedArrayElement(weightedDrivers.value),
  };
}

function genLogBookPage() {
  

  if (vehicleLogSettings.value.vehicle.description === '') {
    vehicleLogSettings.value.vehicle.description = randVehicle();
  }

  if (vehicleLogSettings.value.vehicle.id === '') {
    const letters = randSequence({size: 2, chars: 'AZXTVHCW'});
    const num = Intl.NumberFormat('en-US', {minimumIntegerDigits: 3}).format(
      randNumber({min: 1, max: 20}),
    );
    vehicleLogSettings.value.vehicle.id = `${letters}-${num}`;
  }

  if (vehicleLogSettings.value.drivers.length === 0) {
    const d1 = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      randWeight: faker.number.int({ min: 5, max: 20, multipleOf: 5 }) 
    };

    const d2 = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      randWeight: faker.number.int({ min: 5, max: 20, multipleOf: 5 }) 
    };

    vehicleLogSettings.value.drivers = [d1, d2];
  }

  vehicleLogTable.value = [
    ...Array(vehicleLogSettings.value.numberOfRecords).keys(),
  ].map(v => genRandVehicleLogEntry(v));
}

/* === PDF Functions === */

const {fillSinglePagePdfForm} = useFillPdf();

function fillFormFunc(form: PDFForm, data: Array<VehicleLogEntry>) {
  const vDesc = form.getTextField('vehicleDescription');
  vDesc.setText(vehicleLogSettings.value.vehicle.description);
  vDesc.enableReadOnly();

  const vId = form.getTextField('vehicleId');
  vId.setText(vehicleLogSettings.value.vehicle.id);
  vId.enableReadOnly();

  data.forEach((v, idx) => {
    if (idx > 20) {
      return;
    }
    const idxP = idx === 0 ? '' : `_${idx + 1}`;

    const dateField = form.getTextField(`DateTime${idxP}`);
    const fField = form.getCheckBox(`WasRefueled${idxP}`);
    const destField = form.getTextField(`Destinations${idxP}`);
    const driverField = form.getTextField(`driver${idxP}`);

    dateField.setText(
      new Intl.DateTimeFormat('en-US', dateTimeOptions.value).format(
        v.dateTime,
      ),
    );
    if (v.refueled) {
      fField.check();
    }
    destField.setText(v.destinations);
    driverField.setText(v.driver);

    dateField.enableReadOnly();
    fField.enableReadOnly();
    destField.enableReadOnly();
    driverField.enableReadOnly();
  });
}

const {createDownload} = useDownloadPDF<Array<VehicleLogEntry>>(
  'VehicleLog',
  vehicleLogTable,
  data => fillSinglePagePdfForm('/VehicleLog.pdf', true, data, fillFormFunc),
);

/* === Table Functions === */

// const onCellEditComplete = (event: Event) => {
//   let {data, newValue, field} = event;

//   switch (field) {
//     default:
//       if (newValue.trim().length > 0) data[field] = newValue;
//       else event.preventDefault();
//       break;
//   }
// };

const dateTimeOptions = ref({
  dateStyle: 'short' as const,
  timeStyle: 'short' as const,
  hourCycle: 'h24' as const,
});

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', dateTimeOptions.value).format(date);
};
</script>

<template>
  <Panel class="shadow">
    <template #header>
      <span class="text-xl font-semibold">
        Prop - Vehicle<span class="text-primary text-sky-700">Log</span>
      </span>
    </template>
    <template #icons>
      <div class="flex items-center justify-between gap-4">
        <Button
          icon="pi pi-download"
          severity="Secondary"
          rounded
          raised
          label="Download Log"
          @click="createDownload()"
        />

        <Button
          icon="pi pi-cog"
          severity="Secondary"
          rounded
          raised
          label="Setup"
          @click="toggleConfigVisible()"
        />
      </div>
    </template>

    <DataTable :value="vehicleLogTable" tableStyle="min-width: 50rem">
      <Column field="dateTime" header="Date / Time" style="width: 20%">
        <template #body="{data, field}">
          {{ formatDateTime(data[field]) }}
        </template>
        <template #editor="{data, field}">
          <DatePicker v-model="data[field]" />
        </template>
      </Column>

      <Column field="refueled" header="Refueled"> </Column>

      <Column field="destinations" header="Destinations"></Column>
      <Column field="driver" header="Driver"></Column>
    </DataTable>
  </Panel>
  <Drawer
    v-model:visible="isVisibleConfig"
    header="Setting for Vehicle Log Prop"
    position="bottom"
    style="height: auto"
  >
    <VehicleLogSettingsDrawer
      v-model="vehicleLogSettings"
      @regenerateLogBook="genLogBookPage"
    />
  </Drawer>
</template>
