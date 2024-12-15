<script setup lang="ts">
import {VehicleLogSettings} from '../../vite-env';

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
    drivers: [],
  },
});

const emit = defineEmits<{
  regenerateLogBook: [];
}>();
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

        <label for="MinTripsDay" class="FieldsetDates_MinLabel font-bold block mb-2">
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

        <label for="MaxTripsDay" class="FieldsetDates_MaxLabel font-bold block mb-2">
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
      </div>
    </Fieldset>

    <Fieldset legend="Vehicle Logbook - Vehicle Description">
      <div class="flex-auto">
        <label for="Description" class="font-bold block mb-2">
          Vehicle Type
        </label>
        <InputGroup inputId="Description">
          <InputGroupAddon>
            <Button icon="pi pi-check" severity="secondary" />
          </InputGroupAddon>
          <InputText />
          <InputGroupAddon>
            <Button icon="pi pi-times" severity="secondary" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Fieldset>

    <Fieldset legend="Vehicle Logbook - Destinations">
      <div class="flex-auto">
        <label for="Description" class="font-bold block mb-2">
          Vehicle Type
        </label>
        <InputGroup inputId="Description">
          <InputGroupAddon>
            <Button icon="pi pi-check" severity="secondary" />
          </InputGroupAddon>
          <InputText />
          <InputGroupAddon>
            <Button icon="pi pi-times" severity="secondary" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Fieldset>

    <Fieldset legend="Vehicle Logbook - Drivers">
      <div class="flex-auto">
        <label for="Description" class="font-bold block mb-2">
          Vehicle Type
        </label>
        <InputGroup inputId="Description">
          <InputGroupAddon>
            <Button icon="pi pi-check" severity="secondary" />
          </InputGroupAddon>
          <InputText />
          <InputGroupAddon>
            <Button icon="pi pi-times" severity="secondary" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Fieldset>
  </div>
</template>

<style scoped>
.settingsContainer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem 2rem;
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
  grid-template-rows: repeat(6, min-content);
  gap: 0 2rem;
  grid-template-areas:
    'PickerLabel . .'
    'Picker Picker Picker'
    'SliderLabel . .'
    'Slider Slider Slider'
    'MinLabel . MaxLabel'
    'MinInput . MaxInput';
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
</style>
