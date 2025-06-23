import { User } from "../../common/user.js";
import { PB_MessageToClient } from "../../common/pb.js";


export class BotLogicHandler {
    user: User;
    thingWeSendMessagesTo: any;
    
    constructor(botType: string, thingWeSendMessageTo: any, userclientId: number) {
        this.thingWeSendMessagesTo = thingWeSendMessageTo;
        this.user = new User(userclientId, `Bot (${botType})`);
    }
    

    handleMessage(message: PB_MessageToClient) {
        if (message.game && message.game.gameSetupChange) {
            // ...logic to decide if the bot should ready up...
            // Send an approve message as the bot
            
        }
    }
}