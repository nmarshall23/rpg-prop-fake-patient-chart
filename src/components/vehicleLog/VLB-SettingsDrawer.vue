<script setup lang="ts">
import {randNumber, randSequence, randVehicle} from '@ngneat/falso';
import {VehicleLogSettings} from '../../vite-env';
import {ref} from 'vue';
import {faker} from '@faker-js/faker';
import {useFakerUtils} from '../../composables/useFakerUtils';

const vehicleLogSettings = defineModel<VehicleLogSettings>({
  required: true,
  default: {
    numberOfRecords: 4,
    date: {
      maxDailyTrips: 4,
      minDailyTrips: 2,
      dailyTrips: [1, 2],
      range: [new Date(), new Date()],
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
    destinations: [],
  },
});

const emit = defineEmits<{
  regenerateLogBook: [];
}>();

function updateVehicleDesc() {
  vehicleLogSettings.value.vehicle.description = faker.vehicle.vehicle()
}

function updateVehicleId() {
  const letters = randSequence({size: 2, chars: 'AZXTVHCW'});
  const num = Intl.NumberFormat('en-US', {minimumIntegerDigits: 3}).format(
    randNumber({min: 1, max: 20}),
  );
  vehicleLogSettings.value.vehicle.id = `${letters}-${num}`;
}

const {createStreetAddress, createDriver} = useFakerUtils();

function addDriver() {
  const d1 = createDriver();

  vehicleLogSettings.value.drivers.push(d1);
}

function deleteDriver(index: number) {
  const filteredList = vehicleLogSettings.value.drivers.filter(
    (_v, i) => i != index,
  );

  vehicleLogSettings.value.drivers = filteredList;
}

const fieldsetContentPt = ref({
  content: {class: 'flex gap-3 mt-2'},
});

function addDest() {
  const c = createStreetAddress();
  vehicleLogSettings.value.destinations.push(c);
}

function deleteDest(index: number) {
  const filteredList = vehicleLogSettings.value.destinations.filter(
    (_v, i) => i != index,
  );

  vehicleLogSettings.value.destinations = filteredList;
}
</script>

<template>
  <div class="settingsContainer">
    <Fieldset legend="Vehicle Logbook Page">
      <div class="FieldsetPage">
        <label for="numberOfRecords" class="font-bold block mb-2"
          >Number of Records
        </label>
        <InputNumber
          class="w-52"
          inputId="numberOfRecords"
          v-model.number="vehicleLogSettings.numberOfRecords"
          :min="4"
          :max="21"
        />
        <Slider
          class="my-3"
          v-model="vehicleLogSettings.numberOfRecords"
          :min="4"
          :max="21"
        />

        <Button
          class="FieldsetPageButton"
          label="Regenerate Logbook Page"
          icon="pi pi-database"
          size="large"
          raised
          @click="emit('regenerateLogBook')"
        />
      </div>
    </Fieldset>

    <Fieldset legend="Vehicle Logbook - Dates">
      <div class="FieldsetDates">
        <label
          for="DatesDriven"
          class="FieldsetDates_PickerLabel font-bold block mb-2"
        >
          Dates Driven
        </label>
        <DatePicker
          class="FieldsetDates_Picker"
          inputId="DatesDriven"
          v-model="vehicleLogSettings.date.range"
          selectionMode="range"
          :numberOfMonths="2"
        />

        <label
          for="TripsDayRange"
          class="FieldsetDates_SliderLabel font-bold block my-2"
        >
          Trips per Day
        </label>
        <Slider
          class="FieldsetDates_Slider mb-3"
          inputId="TripsDayRange"
          v-model="vehicleLogSettings.date.dailyTrips"
          range
          :min="1"
          :max="21"
        />

        <label
          for="MinTripsDay"
          class="FieldsetDates_MinLabel font-bold block mb-2"
        >
          Min Trips per Day
        </label>
        <InputNumber
          class="FieldsetDates_MinInput"
          v-model="vehicleLogSettings.date.dailyTrips[0]"
          showButtons
          inputId="MinTripsDay"
          buttonLayout="horizontal"
          :min="1"
          :max="vehicleLogSettings.date.dailyTrips[1]"
          :inputStyle="{maxWidth: '3rem'}"
        />

        <label
          for="MaxTripsDay"
          class="FieldsetDates_MaxLabel font-bold block mb-2"
        >
          Max Trips per Day
        </label>
        <InputNumber
          class="FieldsetDates_MaxInput"
          v-model="vehicleLogSettings.date.dailyTrips[1]"
          showButtons
          inputId="MaxTripsDay"
          buttonLayout="horizontal"
          :min="vehicleLogSettings.date.dailyTrips[0]"
          :max="21"
          :inputStyle="{maxWidth: '3rem'}"
        />

        <label
          for="includeWeekends"
          class="FieldsetDates_WeekendLabel font-bold block my-2"
        >
          Include Weekends
        </label>
        <ToggleSwitch
          class="FieldsetDates_WeekendSwitch"
          inputId="includeWeekends"
          v-model="vehicleLogSettings.date.includeWeekends"
        />
      </div>
    </Fieldset>

    <Fieldset legend="Time" :pt="fieldsetContentPt">
      <FloatLabel variant="on">
        <DatePicker
          v-model="vehicleLogSettings.time.start"
          inputId="on_label"
          showIcon
          iconDisplay="input"
          timeOnly
        >
          <template #inputicon>
            <i class="pi pi-clock" />
          </template>
        </DatePicker>
        <label for="on_label">Start Time</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <DatePicker
          v-model="vehicleLogSettings.time.end"
          inputId="on_label"
          showIcon
          iconDisplay="input"
          timeOnly
        >
          <template #inputicon>
            <i class="pi pi-clock" />
          </template>
        </DatePicker>
        <label for="on_label">End Time</label>
      </FloatLabel>
    </Fieldset>

    <Fieldset
      legend="Vehicle Logbook - Vehicle Description"
      :pt="fieldsetContentPt"
    >
      <FloatLabel variant="on">
        <InputGroup inputId="Description">
          <InputText v-model="vehicleLogSettings.vehicle.description" />
          <InputGroupAddon>
            <Button
              icon="pi pi-refresh"
              severity="secondary"
              @click="updateVehicleDesc()"
            />
          </InputGroupAddon>
        </InputGroup>

        <label for="Description"> Vehicle Type </label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputGroup inputId="vehicleId">
          <InputText v-model="vehicleLogSettings.vehicle.id" />
          <InputGroupAddon>
            <Button
              icon="pi pi-refresh"
              severity="secondary"
              @click="updateVehicleId()"
            />
          </InputGroupAddon>
        </InputGroup>

        <label for="vehicleId"> Vehicle Id </label>
      </FloatLabel>
    </Fieldset>

    <Fieldset legend="Vehicle Logbook - Destinations">
      <DataTable
        :value="vehicleLogSettings.destinations"
        size="small"
        tableStyle="min-width: 30rem"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Destinations </span>
            <Button icon="pi pi-plus" rounded raised @click="addDest()" />
          </div>
        </template>

        <Column :field="p => `${p.name}`" header="Name"> </Column>

        <Column field="randWeight" header="Probability"></Column>
        <Column :exportable="false" style="min-width: 12rem">
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

    <Fieldset legend="Vehicle Logbook - Drivers">
      <DataTable
        :value="vehicleLogSettings.drivers"
        size="small"
        tableStyle="min-width: 30rem"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Drivers </span>
            <Button icon="pi pi-plus" rounded raised @click="addDriver()" />
          </div>
        </template>

        <Column :field="p => `${p.firstName} ${p.lastName}`" header="Name">
        </Column>
        <Column field="randWeight" header="Probability"></Column>
        <Column :exportable="false" style="min-width: 12rem">
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
  </div>
</template>

<style scoped>
.settingsContainer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: min-content 1fr;
  gap: 1rem 2rem;
  align-items: start;
}

.FieldsetPage {
  display: grid;
  grid-template-columns: 13rem 1fr;
  grid-template-rows: min-content min-content 1fr;
  grid-auto-flow: column;
  gap: 0 2rem;
}

.FieldsetPageButton {
  grid-row: 2 / span 2;
}

.FieldsetDates {
  display: grid;
  grid-template-columns: 9rem 1fr 9rem;
  grid-template-rows: repeat(8, min-content);
  gap: 0 2rem;
  grid-template-areas:
    'PickerLabel . .'
    'Picker Picker Picker'
    'SliderLabel . .'
    'Slider Slider Slider'
    'MinLabel . MaxLabel'
    'MinInput . MaxInput'
    'WeekendLabel . . '
    'WeekendSwitch . .';
}
.FieldsetDates_PickerLabel {
  grid-area: PickerLabel;
}
.FieldsetDates_Picker {
  grid-area: Picker;
}
.FieldsetDates_SliderLabel {
  grid-area: SliderLabel;
}
.FieldsetDates_Slider {
  grid-area: Slider;
}
.FieldsetDates_MinLabel {
  grid-area: MinLabel;
}
.FieldsetDates_MinInput {
  grid-area: MinInput;
}

.FieldsetDates_MaxLabel {
  grid-area: MaxLabel;
}
.FieldsetDates_MaxInput {
  grid-area: MaxInput;
}

.FieldsetDates_WeekendLabel {
  grid-area: WeekendLabel;
}

.FieldsetDates_WeekendSwitch {
  grid-area: WeekendSwitch;
}
</style>
