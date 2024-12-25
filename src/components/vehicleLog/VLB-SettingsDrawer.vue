<script setup lang="ts">
import {VehicleLogSettings} from '../../vite-env';

const vehicleLogSettings = defineModel<VehicleLogSettings>({
  required: true,
});

const emit = defineEmits<{
  regenerateLogBook: [];
}>();
</script>

<template>
  <div class="settingsContainer">
    <VLBSettings_FieldLogbookPage
      v-model="vehicleLogSettings"
      @regenerate-log-book="emit('regenerateLogBook')"
    />

    <VLBSettings_FieldVehicleDsc v-model="vehicleLogSettings" />

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
          v-model="vehicleLogSettings.date.dailyTripsMinMaxCount"
          range
          :min="0"
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
          v-model="vehicleLogSettings.date.dailyTripsMinMaxCount[0]"
          showButtons
          inputId="MinTripsDay"
          buttonLayout="horizontal"
          :min="0"
          :max="vehicleLogSettings.date.dailyTripsMinMaxCount[1]"
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
          v-model="vehicleLogSettings.date.dailyTripsMinMaxCount[1]"
          showButtons
          inputId="MaxTripsDay"
          buttonLayout="horizontal"
          :min="vehicleLogSettings.date.dailyTripsMinMaxCount[0]"
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

    <VLBSettings_FieldDeliveryTimes v-model="vehicleLogSettings" />

    <VLBSettings_FieldDestinations v-model="vehicleLogSettings" />

    <VLBSettings_FieldDrivers v-model="vehicleLogSettings" />
  </div>
</template>

<style scoped>
.settingsContainer {
  display: grid;
  grid-template-columns: 26rem 1fr 1fr;
  grid-template-rows: repeat(4, min-content);
  gap: 1rem 2rem;
  align-items: start;
  grid-auto-flow: column;
  --p-floatlabel-over-active-top: -1rem;
}

.settingsContainer:deep(:nth-child(5)) {
  grid-column: 2 / 3;
  grid-row: span 4;
}

.settingsContainer:deep(:nth-child(6)) {
  grid-column: 3 / 4;
  grid-row: span 4;
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
