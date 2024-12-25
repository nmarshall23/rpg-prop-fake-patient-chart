<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue';
import {randBoolean} from '@ngneat/falso';
import {isDefined, useToggle} from '@vueuse/core';
import {useDownloadPDF} from '../composables/downloadPDF';
import {PDFForm} from 'pdf-lib';
import {useFillPdf} from '../composables/useFillPdf';
import type {VehicleLogEntry} from '../vite-env.d.ts';
import {faker} from '@faker-js/faker';
import {useFormatters} from '../composables/useFormatters';
import {useFakerUtils} from '../composables/useFakerUtils';
import {useVLB_Settings} from '../composables/useVLB_Settings';
import { Temporal } from '@js-temporal/polyfill';

// === PAGE REFs === //

const {vehicleLogSettings, weightedDestinations, weightedDrivers, fakeDates} =
  useVLB_Settings();

const vehicleLogTable = ref<Array<VehicleLogEntry>>([]);
const pdfEmbed = ref<HTMLEmbedElement>();
const [isVisibleConfig, toggleConfigVisible] = useToggle();
const [isVisiblePreview, togglePreviewVisible] = useToggle();

/* === PAGE LIFECYCLE === */

onMounted(() => {
  genLogBookPage();
});

/* === Formatting === */

const {formatDateTime} = useFormatters();

/* === RandGenFunc === */

const {createStreetAddress, createDriver, randVehicleId} = useFakerUtils();

function genRandVehicleLogEntry(value: number): VehicleLogEntry {
  return {
    key: `${value}`,
    dateTime: fakeDates.value[value],

    refueled: randBoolean(),
    destinations: faker.helpers.weightedArrayElement(
      weightedDestinations.value,
    ),
    driver: faker.helpers.weightedArrayElement(weightedDrivers.value),
  };
}

function genLogBookPage() {
  if (vehicleLogSettings.value.date.range.length === 0) {
    vehicleLogSettings.value.date.range[0] = faker.date.recent({days: 10});
    vehicleLogSettings.value.date.range[1] = new Date();

    console.log('Date ', Temporal.Now.plainDateTimeISO().withPlainTime({ hour: 9, minute: 0}).toJSON())
  }

  if (vehicleLogSettings.value.vehicle.description === '') {
    vehicleLogSettings.value.vehicle.description = faker.vehicle.vehicle();
  }

  if (vehicleLogSettings.value.vehicle.id === '') {
    vehicleLogSettings.value.vehicle.id = randVehicleId();
  }

  if (vehicleLogSettings.value.drivers.length === 0) {
    vehicleLogSettings.value.drivers = [createDriver(), createDriver()];
  }

  if (vehicleLogSettings.value.destinations.length === 0) {
    vehicleLogSettings.value.destinations = [
      createStreetAddress(),
      createStreetAddress(),
      createStreetAddress(),
    ];
  }

  // const vlbEntries =

  vehicleLogTable.value = [
    ...Array(vehicleLogSettings.value.numberOfRecords).keys(),
  ].reduce<Array<VehicleLogEntry>>((acc, idx) => {
    const value = genRandVehicleLogEntry(idx);
    acc.push(value);
    return acc;
  }, []);
}

/* === PDF Functions === */

const {fillSinglePagePdfForm, setFormFieldsReadonly} = useFillPdf();

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

    dateField.setText(formatDateTime(v.dateTime));

    if (v.refueled) {
      fField.check();
    }

    destField.setText(v.destinations);
    driverField.setText(v.driver);
  });

  setFormFieldsReadonly(form);
}

const {createDownload} = useDownloadPDF<Array<VehicleLogEntry>>(
  'VehicleLog',
  vehicleLogTable,
  data => fillSinglePagePdfForm('/VehicleLog.pdf', true, data, fillFormFunc),
);

async function showPreviewDialog() {
  const pdfDataUri = await fillSinglePagePdfForm(
    '/VehicleLog.pdf',
    true,
    vehicleLogTable.value,
    fillFormFunc,
  );
  console.info('Show PDF preview');
  togglePreviewVisible(true);

  await nextTick();
  if (isDefined(pdfEmbed.value)) {
    pdfEmbed.value.src = pdfDataUri;

    console.info('Set PDF Embed');
  }
}
</script>

<template>
  <Panel
    class="shadow"
    :pt="{
      contentContainer: {
        style: '--p-panel-content-padding: 0 0 2rem 0',
      },
    }"
  >
    <template #header>
      <span class="text-xl font-semibold">
        <span class="text-primary text-sky-700">Prop</span> - Vehicle<span
          class="text-primary text-sky-700"
          >LogBook</span
        >
        Page
      </span>
    </template>
    <template #icons>
      <div class="flex items-center justify-between gap-4">
        <Button
          icon="pi pi-image"
          severity="Secondary"
          rounded
          raised
          label="Preview PDF"
          @click="showPreviewDialog()"
        />

        <Button
          icon="pi pi-download"
          severity="Secondary"
          rounded
          raised
          label="Download PDF"
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

    <Divider />
    <span class="pl-8"
      >Vehicle Description: {{ vehicleLogSettings.vehicle.description }} - ID:
      {{ vehicleLogSettings.vehicle.id }}
    </span>
    <VLB-DataTable v-model="vehicleLogTable" />
  </Panel>
  <Drawer
    v-model:visible="isVisibleConfig"
    header="Setting for Vehicle Log Prop"
    position="bottom"
    style="height: auto"
  >
    <VLB-SettingsDrawer
      v-model="vehicleLogSettings"
      @regenerateLogBook="genLogBookPage"
    />
  </Drawer>
  <Dialog
    v-model:visible="isVisiblePreview"
    modal
    header="Header"
    :style="{width: '70vw'}"
    :breakpoints="{'1199px': '75vw', '575px': '90vw'}"
  >
    <iframe ref="pdfEmbed" style="width: 100%; height: 400px"></iframe>
  </Dialog>
</template>
