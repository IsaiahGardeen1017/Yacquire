import { User } from "../../common/user.js";
import {
    PB_GameAction,
    PB_GameAction_PlayTile,
    PB_MessageToClient,
} from "../../common/pb.js";
import { Implementation } from "./implementations/implementation.js";
import { createImplementationByBotType } from "./implementationPicker.js";
import { Server } from "../server.js";
import { PB_MessageToServer } from "../../common/pb.js";
import { GameRoom } from "../gameRoom.js";
import { NextGameAction } from "../../client/components/NextGameAction.jsx";
import { ActionPlayTile } from "../../common/gameActions/playTile.js";
import { ActionSelectNewChain } from "../../common/gameActions/selectNewChain.js";
import { ActionSelectMergerSurvivor } from "../../common/gameActions/selectMergerSurvivor.js";
import { ActionSelectChainToDisposeOfNext } from "../../common/gameActions/selectChainToDisposeOfNext.js";
import { ActionDisposeOfShares } from "../../common/gameActions/disposeOfShares.js";
import { ActionPurchaseShares } from "../../common/gameActions/purchaseShares.js";
import { ActionGameOver } from "../../common/gameActions/gameOver.js";
import { tileIndexerToTileNum } from "../../common/SaneGameState.js";

export class BotLogicHandler {
    user: User;
    serverRef: Server;
    imp: Implementation;
    id: number;

    hasReadiedUp = false;

    constructor(
        botType: string,
        serverRef: Server,
        userclientId: number,
    ) {
        this.imp = createImplementationByBotType(botType);
        this.serverRef = serverRef;
        this.id = userclientId;
        this.user = new User(userclientId, this.imp.userName);
    }

    async handleMessage(message: PB_MessageToClient) {
        await setTimeout(() => {}, 200); //Delay for 20ms so that we act more like a user

        const botClient = this.serverRef.clientIdToClient.get(this.id);
        if (!botClient) return;
        const gameRoom = botClient?.room as GameRoom;
        if (!gameRoom) return;

        if (
            message.game?.gameSetupChange?.userApprovedOfGameSetup &&
            !this.hasReadiedUp
        ) {
            this.hasReadiedUp = true;
            const numberOfGameSetupChanges =
                gameRoom?.numberOfGameSetupChanges ?? 0;
            const approveMessage = {
                game: {
                    gameSetupAction: {
                        numberOfGameSetupChanges,
                        approve: {},
                    },
                },
            };
            this.serverRef.sendMessage(this.id, approveMessage);
        } else if (message) {
            const gameState = gameRoom.game?.getCurrentGameState();
            const nextAction = gameState?.nextGameAction;
            const myPlayerIndex = gameRoom?.game?.users.findIndex((u) =>
                u.id === this.id
            );

            if (
                gameState && nextAction?.playerId != null &&
                nextAction.playerId === myPlayerIndex
            ) {
                const saneGameState = nextAction.game
                    .getSaneGamestateObject(myPlayerIndex);
                if (nextAction instanceof ActionPlayTile) {
                    const sanePlayableTiles = nextAction.game
                        .getSanePlayableTiles(myPlayerIndex);
                    const tileWeWantToPlay = tileIndexerToTileNum(
                        this.imp.pickTileToPlay(
                            saneGameState,
                            sanePlayableTiles,
                        ),
                    );

                    // Send the playTile message
                    const playTileMessage = {
                        game: {
                            gameAction: {
                                numberOfGameStates:
                                    gameRoom.game!.gameStateHistory.length,
                                gameAction: PB_GameAction.create({
                                    playTile: {
                                        tile: tileWeWantToPlay,
                                    },
                                }),
                            },
                        },
                    };
                    this.serverRef.sendMessage(this.id, playTileMessage);
                } else if (nextAction instanceof ActionSelectNewChain) {
                    const startableChains = nextAction.game
                        .getSaneStartableChains();
                    const selectedChain = this.imp.pickChainToStart(
                        startableChains,
                    );
                    const pickChainMessage = {
                        game: {
                            gameAction: {
                                numberOfGameStates:
                                    gameRoom.game!.gameStateHistory.length,
                                gameAction: PB_GameAction.create({
                                    selectNewChain: {
                                        chain: selectedChain,
                                    },
                                }),
                            },
                        },
                    };
                    this.serverRef.sendMessage(this.id, pickChainMessage);
                } else if (nextAction instanceof ActionSelectMergerSurvivor) {
                    console.log("Bot needs to select merger survivor");
                } else if (
                    nextAction instanceof ActionSelectChainToDisposeOfNext
                ) {
                    console.log("Bot needs to select chain to dispose of next");
                } else if (nextAction instanceof ActionDisposeOfShares) {
                    console.log("Bot needs to dispose of shares");
                } else if (nextAction instanceof ActionPurchaseShares) {
                    console.log("Bot needs to purchase shares");
                } else if (nextAction instanceof ActionGameOver) {
                    console.log("Game is over");
                } else {
                    console.log(
                        "Unknown action type:",
                        nextAction.constructor.name,
                    );
                }
                console.log("actioning");
            }
        }
    }
}
