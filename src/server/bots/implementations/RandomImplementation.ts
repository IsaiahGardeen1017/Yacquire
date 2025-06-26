import { getRandomNumber } from "../../../common/helpers.js";
import { SaneGameState, Tile } from "../../../common/SaneGameState.js";
import { Implementation } from "./implementation.js";

function randomName(): string {
    return `Hal-${getRandomNumber(1000, 9999)}`;
}

export class RandomImplementation extends Implementation {
    name: string | undefined;

    get userName(): string {
        if (!this.name) {
            this.name = randomName();
        }
        return this.name;
    }

    pickTileToPlay(gameState: SaneGameState, tileOptions: Tile[]): Tile {
        return tileOptions[0];
    }

    pickChainToStart(options: number[]): number {
        return options[0];
    }
}
