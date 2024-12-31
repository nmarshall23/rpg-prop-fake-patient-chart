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
    // min Trip Duration 
    // Trip Variance Min
}

type TimeVarianceType = 'before' | 'after'

export interface VehicleLogSettings {
    numberOfRecords: number;
    date: {
        dailyTripsMinMaxCount: Array<number>
        range: Array<Date>;
        includeWeekends: boolean;
    };
    time: {
        firstTripTime: Date
        lastTripTime: Date,
        firstTripVarianceMins: number
        firstTripVarianceType: TimeVarianceType[]
        lastTripVarianceMins: number
        lastTripVarianceType: TimeVarianceType[]
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
    dailyTripCounter?: number
}