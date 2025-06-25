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
    //-1 = empty, -2 == black, -3 == mergeTile / new chain
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

    playerNetWorths: number[];
    playerCash: number[];

    mergeTile?: Tile;
    mergeOptions?: MergeOption[];
};
