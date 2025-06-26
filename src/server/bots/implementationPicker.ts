import { RandomImplementation } from "./implementations/RandomImplementation.js";

export function createImplementationByBotType(botType: string) {
    return new RandomImplementation();
}
