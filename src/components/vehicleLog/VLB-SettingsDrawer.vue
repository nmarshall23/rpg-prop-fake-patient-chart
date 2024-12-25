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

    <VLBSettings_FieldDates v-model="vehicleLogSettings" />

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





</style>
