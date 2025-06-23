import { TestImplementation } from "./implementations/tester.js";

export function createImplementationByBotType(botType: string) {
    return new TestImplementation();
}
