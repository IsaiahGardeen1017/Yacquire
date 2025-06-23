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
    gameRoom: GameRoom;

    constructor(
        botType: string,
        serverRef: Server,
        userclientId: number,
        gameRoom: GameRoom,
    ) {
        this.gameRoom = gameRoom;
        this.imp = createImplementationByBotType(botType);
        this.serverRef = serverRef;
        this.id = userclientId;
        this.user = new User(userclientId, this.imp.userName);
    }

    handleMessage(message: PB_MessageToClient) {
        if (message) {
            console.log("===");
        }
        if (message?.game?.gameSetupChange?.userAdded) {
            // We don't
            console.log("ready up now?");
        }
        const alwaysFalse = false;
        if (alwaysFalse) {
            const approvals = message?.game?.connectResponse?.metadata
                ?.approvals;
            const myIndex = message?.game?.connectResponse?.metadata?.userIds
                .indexOf(this.user.id);
            console.log("APPROVING");
            console.log(approvals);
            console.log(myIndex);
            if (approvals && myIndex !== undefined && !approvals[myIndex]) {
                const numberOfGameSetupChanges =
                    this.gameRoom?.numberOfGameSetupChanges ?? 0;
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
        }
    }
}
