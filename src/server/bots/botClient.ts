import { concatenateUint8Arrays } from "../../common/helpers.js";
import { User } from "../../common/user.js";
import { Client } from "../client.js";
import { BotLogicHandler } from "./botLogicHandler.js";
import { PB_MessageToClient } from "../../common/pb.js";


export class BotClient extends Client {

    logicHandler: BotLogicHandler;

    constructor(clientId: number, botLogicHandler: BotLogicHandler) {
        super(clientId, () => {});
        this.logicHandler = botLogicHandler;
    }

    sendMessage(message: Uint8Array) {
        const decodedMessage = PB_MessageToClient.fromBinary(message);
        this.logicHandler.handleMessage(decodedMessage);
    }

    endResponse() {
        console.log("Ending Response");
        super.endResponse();
    }
    beginResponse() {
        console.log("Begin Response");
        super.beginResponse();
    }
}
