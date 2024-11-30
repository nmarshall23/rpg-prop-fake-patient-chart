import { randFullName, rand } from '@ngneat/falso';
import { capitalCase } from 'change-case'

export function useFakeCharts() {

    function getPatientCharts() {

        return [...Array(60).keys()].map((value) => {
            const gender = rand<"male" | "female">(['male', 'female'])
            return {
                key: `${value}`,
                data: {
                    name: randFullName({ gender, withAccents: false }),
                    gender: capitalCase(gender),
                    age: 43
                }
            }
        })
    }

    return {
        getPatientCharts,
    }
}