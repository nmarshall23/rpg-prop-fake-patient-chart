<script setup lang="ts">
import {faker} from '@faker-js/faker';
import {VehicleLogSettings} from '../../vite-env';
import {usePTs} from '../../composables/usePTs';
import {useFakerUtils} from '../../composables/useFakerUtils';

const settings = defineModel<VehicleLogSettings>({required: true});

const {ptContentFlex} = usePTs();

const {randVehicleId} = useFakerUtils();

function updateVehicleDesc() {
  settings.value.vehicle.description = faker.vehicle.vehicle();
}

function updateVehicleId() {
  settings.value.vehicle.id = randVehicleId();
}
</script>

<template>
  <Fieldset legend="Vehicle Logbook - Vehicle Description" :pt="ptContentFlex">
    <FloatLabel variant="on">
      <InputGroup inputId="Description">
        <InputText v-model="settings.vehicle.description" />
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
        <InputText v-model="settings.vehicle.id" class="w-28" />
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
</template>
