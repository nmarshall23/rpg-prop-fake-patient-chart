/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface VehicleLogDriver {
    firstName: string,
    lastName: string
    randWeight: number
}

interface VehicleLogDest {
    name: string
    randWeight: number

}

export interface VehicleLogSettings {
    numberOfRecords: number;
    date: {
        dailyTrips: Array<number>
        maxDailyTrips: number;
        minDailyTrips: number;
        range: Array<Date>;
        includeWeekends: boolean;
    };
    time: {
        start: Date
        end: Date
    }
    drivers: Array<VehicleLogDriver>;
    vehicle: {
        description: string
        id: string
    }
    destinations: Array<VehicleLogDest>
}

export interface VehicleLogEntry {
    key: string,
    dateTime: Date
    refueled: boolean
    destinations: string
    driver: string
}