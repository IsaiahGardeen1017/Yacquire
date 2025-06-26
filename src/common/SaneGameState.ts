/**

Tower = 0
Luxor = 1
WorldWide = 2
American = 3
Green = 4
Continental = 5
Imperial = 6


 */

export type Tile = {
    l: number;
    n: number;
};

export type MergeOption = {
    survivor: number;
    leaver: number;
};

export type SaneGameState = {
    numPlayers: number;

    // A7 == board[0][6]
    //-1 = empty, -2 == black, -3 == mergeTile, -4 == dead
    board: number[][];

    //Tiles in my hand
    myTiles: Tile[];

    //First index is player index
    //Second index is hotel chain index
    //Value is the number of stocks they have
    stocks: number[][];

    //Index is hotel chain index
    //Value is the price per share
    stockValues: number[];

    stocksAvailable: number[];

    playerNetWorths: number[];
    playerCash: number[];

    mergeTile?: Tile;
    mergeOptions?: MergeOption[];
};

export function tileNumToTileIndexer(t: number): Tile {
    const l = t % 9; // column index (A=0, B=1, ... I=8)
    const n = Math.floor(t / 9); // row index (0 is first row)
    return { l, n };
}

export function tileIndexerToTileNum(tile: Tile): number {
    return tile.n * 9 + tile.l;
}
