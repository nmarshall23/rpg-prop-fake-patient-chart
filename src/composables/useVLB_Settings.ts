
function defaultVLBSettings() {
    return {
        numberOfRecords: 10,
        date: {
            dailyTripsMinMaxCount: [0, 2],
            range: [],
            includeWeekends: false,
        },
        time: {
            firstTripTime: new Date(),
            lastTripTime: new Date(),
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
    }
}


export function useVLB_Settings() {

    return {
        defaultVLBSettings,
    }
}