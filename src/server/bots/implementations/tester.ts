import { getRandomNumber } from "../../../common/helpers.js";
import { Implementation } from "./implementation.js";

function randomName(): string {
    return `Hal-${getRandomNumber(1000, 9999)}`;
}

export class TestImplementation extends Implementation {
    name: string | undefined;

    get userName(): string {
        if (!this.name) {
            this.name = randomName();
        }
        return this.name;
    }
}
