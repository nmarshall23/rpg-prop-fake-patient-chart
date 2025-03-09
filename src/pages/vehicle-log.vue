<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue';
import {randBoolean} from '@ngneat/falso';
import {isDefined, useToggle} from '@vueuse/core';
import {useDownloadPDF} from '../composables/downloadPDF';
import {PDFForm} from 'pdf-lib';
import {useFillPdf} from '../composables/useFillPdf';
import type {VehicleLogEntry, VehicleLogSettings} from '../vite-env.d.ts';
import {faker} from '@faker-js/faker';
import {useFormatters} from '../composables/useFormatters';
import {useFakerUtils} from '../composables/useFakerUtils';
import {useVLB_Settings} from '../composables/useVLB_Settings';
import {Temporal} from '@js-temporal/polyfill';
import {match, P} from 'ts-pattern';

// === PAGE REFs === //

const {vehicleLogSettings, weightedDestinations, weightedDrivers, fakeDates} =
  useVLB_Settings();

const vehicleLogTable = ref<Array<VehicleLogEntry>>([]);
const pdfEmbed = ref<HTMLObjectElement>();
const [isVisibleConfig, toggleConfigVisible] = useToggle();
const [isVisiblePreview, togglePreviewVisible] = useToggle();

const docTitle = computed(() => {
  const date1 = vehicleLogTable.value[0]?.dateTime ?? new Date();
  const date2 = vehicleLogTable.value.at(-1)?.dateTime ?? new Date();
  const fmt = new Intl.DateTimeFormat('en', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
  });

  return `LogBook ${vehicleLogSettings.value.vehicle.id} ${fmt.formatRange(date1, date2)}`;
});
/* === PAGE LIFECYCLE === */

onMounted(() => {
  genLogBookPage();
});

/* === Formatting === */

const {formatDateTime} = useFormatters();

/* === RandGenFunc === */

const {createStreetAddress, createDriver, randVehicleId} = useFakerUtils();

function fmtDate(date: Date) {
  const numFmt = Intl.NumberFormat('en-US', {minimumIntegerDigits: 2});
  return `${date.getFullYear()}-${numFmt.format(date.getMonth() + 1)}-${numFmt.format(date.getDate())}`;
}

function firstTripDate(settings: VehicleLogSettings, time: Temporal.PlainTime) {
  const dateStr = fmtDate(settings.date.range[0]);

  const p1date = Temporal.PlainDate.from(dateStr);
  const newPDate = time.toPlainDateTime(p1date);

  return new Date(newPDate.toString());
}

function randFirstTripDate(
  settings: VehicleLogSettings,
  time: Temporal.PlainTime,
) {
  const p1date = Temporal.PlainDate.from(fmtDate(settings.date.range[0]));
  const p2date = Temporal.PlainDate.from(fmtDate(settings.date.range[1]));
  const days = Math.round(p1date.until(p2date).days / 4);
  const daysToAdd = faker.number.int(days);
  const newPDate = time.toPlainDateTime(p1date.add({days: daysToAdd}));

  return new Date(newPDate.toString());
}

function randTripDate(settings: VehicleLogSettings, time: Temporal.PlainTime) {

  
}

function randFirstTripTime(settings: VehicleLogSettings) {
  const time = new Intl.DateTimeFormat('en-US', {
    timeStyle: 'medium',
    hour12: false,
  }).format(settings.time.firstTripTime);

  const plainTime = Temporal.PlainTime.from(time);

  const tripVar = match(settings.time.firstTripVarianceType)
    .with([], () => undefined)
    .otherwise(a => faker.helpers.arrayElement(a));

  const minutes = faker.number.int(settings.time.firstTripVarianceMins);

  const randTime = match(tripVar)
    .with('before', () => {
      return plainTime.add({minutes});
    })
    .with('after', () => {
      return plainTime.subtract({minutes});
    })
    .otherwise(() => plainTime);

  return randTime;
}

function genRandVehicleLogEntry(
  value: number,
  prevEntry: VehicleLogEntry | undefined,
): VehicleLogEntry {
  const entry: Partial<VehicleLogEntry> = {
    key: `${value}`,
    destinations: faker.helpers.weightedArrayElement(
      weightedDestinations.value,
    ),
    driver: faker.helpers.weightedArrayElement(weightedDrivers.value),
    refueled: false,
    dateTime: undefined,
  };

  return (
    match([prevEntry, vehicleLogSettings.value])
      // first Entry Random Date
      .with(
        [
          P.nullish,
          {
            date: {
              dailyTripsMinMaxCount: [0, P.number],
            },
          },
        ],
        ([_, settings]) => {
          const time = randFirstTripTime(settings);
          const date = randFirstTripDate(settings, time);
          entry.dateTime = date;
          entry.dailyTripCounter = 1;
          return entry as VehicleLogEntry;
        },
      )
      //
      .with(
        [
          {
            dailyTripCounter: P.number.lt(
              vehicleLogSettings.value.date.dailyTripsMinMaxCount[1],
            ),
          },
          {
            date: {
              dailyTripsMinMaxCount: [0, P.number],
            },
          },
        ],
        ([prevEntry, settings]) => {
          // const time = randFirstTripTime(settings);
          // const date = randFirstTripDate(settings, time);
          // entry.dateTime = date;
          entry.dailyTripCounter = prevEntry.dailyTripCounter + 1;
          return entry as VehicleLogEntry;
        },
      )
      // rand next day
      .with(
        [
          {
            dailyTripCounter: P.number.lte(
              vehicleLogSettings.value.date.dailyTripsMinMaxCount[1],
            ),
          },
          {
            date: {
              dailyTripsMinMaxCount: [0, P.number],
            },
          },
        ],
        ([_, settings]) => {
          // const time = randFirstTripTime(settings);
          // const date = randFirstTripDate(settings, time);
          // entry.dateTime = date;
          entry.dailyTripCounter = 1;
          return entry as VehicleLogEntry;
        },
      )

      // first Entry
      .with(
        [
          P.nullish,
          {
            date: {
              dailyTripsMinMaxCount: [P.number, P.number],
            },
          },
        ],
        ([_, settings]) => {
          const time = randFirstTripTime(settings);
          const date = firstTripDate(settings, time);
          entry.dateTime = date;
          entry.dailyTripCounter = 1;
          return entry as VehicleLogEntry;
        },
      )
      //
      .otherwise(() => {
        entry.refueled = faker.datatype.boolean(0.1);
        entry.dateTime = fakeDates.value[value];
        return entry as VehicleLogEntry;
      })
  );
}

function genLogBookPage() {
  if (vehicleLogSettings.value.date.range.length === 0) {
    vehicleLogSettings.value.date.range[0] = faker.date.recent({days: 10});
    vehicleLogSettings.value.date.range[1] = new Date();
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
    const prevEntry = acc[idx - 1];

    const value = genRandVehicleLogEntry(idx, prevEntry);
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
  docTitle,
  vehicleLogTable,
  data =>
    fillSinglePagePdfForm(
      docTitle,
      '/VehicleLog.pdf',
      true,
      data,
      fillFormFunc,
    ),
);

async function showPreviewDialog() {
  const pdfDataUri = await fillSinglePagePdfForm(
    docTitle,
    '/VehicleLog.pdf',
    true,
    vehicleLogTable.value,
    fillFormFunc,
  );
  console.info('Show PDF preview');
  togglePreviewVisible(true);

  await nextTick();
  if (isDefined(pdfEmbed.value)) {
    const fileName = `LogBook - ${vehicleLogSettings.value.vehicle.id} - ${vehicleLogSettings.value.date.range[0].toDateString()}`;

    const file_header = ';headers=filename%3D';

    pdfEmbed.value.data = pdfDataUri.replace(
      ';',
      file_header + encodeURIComponent(docTitle.value) + ';',
    );

    console.info('Set PDF Embed %o', fileName);
  }
}

const previewBtnCmds = ref([
  {
    label: 'Download PDF',
    command: () => createDownload(),
  },
]);
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
        <SplitButton
          label="Preview PDF"
          @click="showPreviewDialog()"
          :model="previewBtnCmds"
          raised
        />

        <Button
          icon="pi pi-cog"
          severity="info"
          raised
          label="Setup"
          @click="toggleConfigVisible()"
        />
      </div>
    </template>

    <Divider />

    <VLB-DataTable
      v-model="vehicleLogTable"
      v-model:settings="vehicleLogSettings"
      @regenerateLogBook="genLogBookPage"
    />
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
    :style="{width: '70vw'}"
    :breakpoints="{'1199px': '75vw', '575px': '90vw'}"
    :pt="{
      header: {
        class: 'gap-4',
      },
    }"
  >
    <template #header>
      <span class="text-lg font-bold whitespace-nowrap">Preview PDF</span>
      <span class="grow" />
      <Button icon="pi pi-download" rounded raised @click="createDownload()" />
    </template>
    <object
      ref="pdfEmbed"
      type="application/pdf"
      style="width: 100%; height: 400px"
    ></object>
  </Dialog>
</template>
