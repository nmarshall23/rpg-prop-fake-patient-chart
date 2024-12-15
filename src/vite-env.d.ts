/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

export interface VehicleLogSettings {
    numberOfRecords: number;
    date: {
      dailyTrips: Array<number>
      maxDailyTrips: number;
      minDailyTrips: number;
      range: Array<Date>;
      includeWeekends: boolean;
    };
    drivers: Array<string>;
  }

  export interface VehicleLogEntry {
    key: string,
    dateTime: Date
    refueled: boolean
    destinations: string
    driver: string
  }