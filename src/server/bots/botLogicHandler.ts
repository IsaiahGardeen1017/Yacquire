import { User } from "../../common/user.js";
import { PB_MessageToClient } from "../../common/pb.js";
import { Implementation } from "./implementations/implementation.js";
import { createImplementationByBotType } from "./implementationPicker.js";
import { Server } from "../server.js";
import { PB_MessageToServer } from "../../common/pb.js";
import { GameRoom } from "../gameRoom.js";
import { NextGameAction } from "../../client/components/NextGameAction.jsx";
import { ActionPlayTile } from "../../common/gameActions/playTile.js";

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
        }else if(message){
            const gameState = gameRoom.game?.getCurrentGameState();
            const nextAction = gameState?.nextGameAction;
            const myPlayerIndex = gameRoom?.game?.users.findIndex(u => u.id === this.id);
            if(gameState && nextAction?.playerId && nextAction.playerId === myPlayerIndex){
                console.log(nextAction);
                if(nextAction instanceof ActionPlayTile){
                        const naGameState = nextAction.game.getCurrentGameState
                        const tileRack = gameState.tileRacks[this.id];
                        const tileRackIndex = gameState.tileRackTypes[this.id];
                    }else{
                        console.log('here');
                    }
                    console.log('actioning');
            }
        }   
    }
}
