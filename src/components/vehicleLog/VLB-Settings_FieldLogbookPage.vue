<script setup lang="ts">
import {usePTs} from '../../composables/usePTs';
import {VehicleLogSettings} from '../../vite-env';

const settings = defineModel<VehicleLogSettings>({required: true});

const emit = defineEmits<{
  regenerateLogBook: [];
}>();

const {ptContentFlexCol} = usePTs();
</script>

<template>
  <Fieldset legend="Vehicle Logbook Page" :pt="ptContentFlexCol">
    <Button
      label="Regenerate Logbook Page"
      icon="pi pi-database"
      size="large"
      raised
      @click="emit('regenerateLogBook')"
    />
    <Divider style="margin-inline: -1.125rem; width: auto" class="mt-1" />
    <FloatLabel class="mt-2">
      <label for="numberOfRecords">Number of Records </label>
      <InputNumber
        inputId="numberOfRecords"
        v-model.number="settings.numberOfRecords"
        :min="4"
        :max="21"
        showButtons
        buttonLayout="horizontal"
      />
    </FloatLabel>
    <Slider
      class="mb-2 mt-2"
      v-model="settings.numberOfRecords"
      :min="3"
      :max="20"
    />
  </Fieldset>
</template>
