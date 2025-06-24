import { User } from "../../common/user.js";
import { PB_MessageToClient } from "../../common/pb.js";
import { Implementation } from "./implementations/implementation.js";
import { createImplementationByBotType } from "./implementationPicker.js";
import { Server } from "../server.js";
import { PB_MessageToServer } from "../../common/pb.js";
import { GameRoom } from "../gameRoom.js";

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
        }

        if(message){
            console.log('Do some things I think');
        }   
    }
}
