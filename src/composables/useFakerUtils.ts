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

function randDateBetween(from: Date, to: Date) {

}

export function useFakerUtils() {



    return {
        createCompany,
        createStreetAddress,
        createDriver,
    }
}