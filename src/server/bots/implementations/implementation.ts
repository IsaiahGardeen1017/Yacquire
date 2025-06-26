import { SaneGameState, Tile } from "../../../common/SaneGameState";

export abstract class Implementation {
    abstract get userName(): string;

    abstract pickTileToPlay(
        gameState: SaneGameState,
        tileOptions: Tile[],
    ): Tile;

    abstract pickChainToStart(
        options: number[],
    ): number;
}
