<script setup lang="ts">
import {ref} from 'vue';
import {VehicleLogSettings} from '../../vite-env';
import {capitalCase} from 'change-case';

const settings = defineModel<VehicleLogSettings>({required: true});

const fieldsetContentPtGrid2Cols = ref({
  content: {class: 'grid grid-cols-3 gap-y-8 mt-4'},
});

const timeVarOpt = ref(['before', 'after']);

const fmtCapitalCase = (s: string) => capitalCase(s);
</script>

<template>
  <Fieldset legend="Delivery Times" :pt="fieldsetContentPtGrid2Cols">
    <FloatLabel variant="over">
      <DatePicker
        v-model="settings.time.firstTripTime"
        inputId="firstDT"
        showIcon
        iconDisplay="input"
        timeOnly
        :step-minute="5"
        class="w-24"
      >
        <template #inputicon>
          <i class="pi pi-clock" />
        </template>
      </DatePicker>
      <label for="firstDT">First Delivery Time</label>
    </FloatLabel>

    <FloatLabel variant="over" class="col-span-2">
      <label for="stRandom"> First Delivery Variance</label>
      <InputGroup inputId="stRandom">
        <InputNumber
          v-model="settings.time.firstTripVarianceMins"
          suffix=" mins"
          size="small"
          :min="0"
          :max="30"
          :step="5"
          showButtons
        />
        <InputGroupAddon class="p-0">
          <SelectButton
            v-model="settings.time.firstTripVarianceType"
            :options="timeVarOpt"
            multiple
            size="small"
            :option-label="fmtCapitalCase"
          />
        </InputGroupAddon>
      </InputGroup>
    </FloatLabel>

    <FloatLabel variant="over">
      <DatePicker
        v-model="settings.time.lastTripTime"
        inputId="lastDT"
        showIcon
        iconDisplay="input"
        timeOnly
        :step-minute="5"
        class="w-24"
      >
        <template #inputicon>
          <i class="pi pi-clock" />
        </template>
      </DatePicker>
      <label for="lastDT">Last Delivery Time</label>
    </FloatLabel>

    <FloatLabel variant="over" class="col-span-2">
      <label for="stRandom"> Last Delivery Variance</label>
      <InputGroup inputId="stRandom">
        <InputNumber
          v-model="settings.time.lastTripVarianceMins"
          suffix=" mins"
          size="small"
          :min="0"
          :max="30"
          :step="5"
          showButtons
        />
        <InputGroupAddon class="p-0">
          <SelectButton
            v-model="settings.time.firstTripVarianceType"
            :options="timeVarOpt"
            multiple
            size="small"
            :option-label="fmtCapitalCase"
          />
        </InputGroupAddon>
      </InputGroup>
    </FloatLabel>
  </Fieldset>
</template>
