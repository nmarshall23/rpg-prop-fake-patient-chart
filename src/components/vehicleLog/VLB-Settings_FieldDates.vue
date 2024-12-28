<script setup lang="ts">
import {VehicleLogSettings} from '../../vite-env';

const settings = defineModel<VehicleLogSettings>({required: true});
</script>

<template>
  <Fieldset legend="Vehicle Logbook - Dates" class="FieldsetDates">
    <label
      for="DatesDriven"
      class="FieldsetDates_PickerLabel font-bold block "
    >
      Dates Driven
    </label>
    <DatePicker
      class="FieldsetDates_Picker"
      inputId="DatesDriven"
      v-model="settings.date.range"
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
      inputId="TripsDayRange"
      v-model="settings.date.dailyTripsMinMaxCount"
      range
      :min="0"
      :max="10"
    />

    <label
      for="MinTripsDay"
      class="FieldsetDates_MinLabel font-bold block mt-3"
    >
      Min Trips per Day
    </label>

    <label
      for="MaxTripsDay"
      class="FieldsetDates_MaxLabel font-bold block mt-3"
    >
      Max Trips per Day
    </label>

    <InputNumber
      class="FieldsetDates_MinInput"
      v-model="settings.date.dailyTripsMinMaxCount[0]"
      showButtons
      inputId="MinTripsDay"
      buttonLayout="horizontal"
      :min="0"
      :max="settings.date.dailyTripsMinMaxCount[1]"
      :inputStyle="{maxWidth: '3rem'}"
    />

    <InputNumber
      class="FieldsetDates_MaxInput"
      v-model="settings.date.dailyTripsMinMaxCount[1]"
      showButtons
      inputId="MaxTripsDay"
      buttonLayout="horizontal"
      :min="settings.date.dailyTripsMinMaxCount[0]"
      :max="10"
      :inputStyle="{maxWidth: '3rem'}"
    />

    <label
      for="includeWeekends"
      class="FieldsetDates_WeekendLabel font-bold block mt-3"
    >
      Include Weekends
    </label>
    <ToggleSwitch
      class="FieldsetDates_WeekendSwitch"
      inputId="includeWeekends"
      v-model="settings.date.includeWeekends"
    />
  </Fieldset>
</template>

<style scoped>
.FieldsetDates:deep(.p-fieldset-content) {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
}



.FieldsetDates:deep(.p-fieldset-content label[for='DatesDriven']) {
  grid-column: span 3;
}

.FieldsetDates:deep(.p-fieldset-content .p-datepicker) {
  grid-column: span 3;
}

.FieldsetDates:deep(.p-fieldset-content label[for='TripsDayRange']) {
  grid-column: span 3;
}

.FieldsetDates:deep(.p-fieldset-content *[inputId='TripsDayRange']) {
  grid-column: span 3;
}

.FieldsetDates:deep(.p-fieldset-content label[for='MinTripsDay']) {
  grid-column: 1;
}

.FieldsetDates:deep(.p-fieldset-content label[for='MaxTripsDay']) {
  grid-column: 3;
}

.FieldsetDates:deep(.p-fieldset-content .FieldsetDates_MinInput) {
  grid-column: 1;
}

.FieldsetDates:deep(.p-fieldset-content .FieldsetDates_MaxInput) {
  grid-column: 3;
}

.FieldsetDates:deep(.p-fieldset-content label[for='includeWeekends']) {
  grid-column: span 3;
}
</style>
