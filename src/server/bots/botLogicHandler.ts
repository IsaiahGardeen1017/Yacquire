import { User } from "../../common/user";
import { GameRoom } from "../gameRoom";

export class BotLogicHandler {
    user: User;
    thingWeSendMessagesTo: Object; //DOn't know what this is yet.
    constructor(user: User, thingWeSendMessageTo: GameRoom){
        this.user = user;
        this.thingWeSendMessagesTo = thingWeSendMessageTo;
    }

    handleMessage(){

    }
}