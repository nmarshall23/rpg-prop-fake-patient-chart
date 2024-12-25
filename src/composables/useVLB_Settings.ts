import { computed, ref } from "vue";
import { VehicleLogSettings } from "../vite-env";
import { faker } from "@faker-js/faker";
import { Temporal } from "@js-temporal/polyfill";



const vehicleLogSettings = ref<VehicleLogSettings>({
    numberOfRecords: 10,
    date: {
      dailyTripsMinMaxCount: [1, 2],
      range: [],
      includeWeekends: false,
    },
    time: {
      firstTripTime: new Date(Temporal.Now.plainDateTimeISO().withPlainTime({ hour: 8, minute: 0}).toJSON()),
      lastTripTime: new Date(Temporal.Now.plainDateTimeISO().withPlainTime({ hour: 16, minute: 0}).toJSON()),
      firstTripVarianceMins: 10,
      firstTripVarianceType: ['after'],
      lastTripVarianceMins: 20,
      lastTripVarianceType: ['after', 'before'],
    },
    drivers: [],
    vehicle: {
      description: '',
      id: '',
    },
    destinations: [],
  });

const weightedDrivers = computed(() => {
  return vehicleLogSettings.value.drivers.map(v => ({
    weight: v.randWeight,
    value: `${v.firstName} ${v.lastName}`,
  }));
});

const weightedDestinations = computed(() => {
  return vehicleLogSettings.value.destinations.map(v => ({
    weight: v.randWeight,
    value: v.name,
  }));
});

const fakeDates = computed(() => {
   if (vehicleLogSettings.value.date.dailyTripsMinMaxCount[0] === 0 ) {
    return faker.date.betweens({
        from: vehicleLogSettings.value.date.range[0],
        to: vehicleLogSettings.value.date.range[1],
        count: vehicleLogSettings.value.numberOfRecords,
      });
   }

  return faker.date.betweens({
    from: vehicleLogSettings.value.date.range[0],
    to: vehicleLogSettings.value.date.range[1],
    count: vehicleLogSettings.value.numberOfRecords,
  });
});

const fakeWasReFueledList = computed(() => {
    return []
})

export function useVLB_Settings() {


    return {
        vehicleLogSettings,
        weightedDestinations,
        weightedDrivers,
        fakeDates,
        fakeWasReFueledList,
    }
}