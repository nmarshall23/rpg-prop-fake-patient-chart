import { faker } from "@faker-js/faker";
import { VehicleLogDest, VehicleLogEntry, VehicleLogSettings } from "../vite-env";


function createCompany(): VehicleLogDest {
    const c = {
        name: faker.company.name(),
        randWeight: faker.number.int({ min: 5, max: 20, multipleOf: 5 }),
    };

    return c
}

function createStreetAddress(): VehicleLogDest {
    return {
        name: faker.location.streetAddress(true),
        randWeight: faker.number.int({ min: 5, max: 20, multipleOf: 5 }),
    }
}

function createDriver() {
    const d1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        randWeight: faker.number.int({ min: 5, max: 20, multipleOf: 5 }),
    };

    return d1
}

function randVehicleId() {
    const letters = faker.helpers.arrayElements('AZXTVHCW'.split(''), 3);
    const num = Intl.NumberFormat('en-US', { minimumIntegerDigits: 3 }).format(
        faker.number.int({ min: 1, max: 20 }),
    );
    return `${letters.join('')}-${num}`;
}


export function useFakerUtils() {



    return {
        createCompany,
        createStreetAddress,
        createDriver,
        randVehicleId,
    }
}