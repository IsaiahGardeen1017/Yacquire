import { Implementation } from "./implementation.js";

export class TestImplementation extends Implementation {
    name: string | undefined;

    get userName(): string {
        if (!this.name) {
            this.name = "Mr Robot";
        }
        return this.name;
    }
}
