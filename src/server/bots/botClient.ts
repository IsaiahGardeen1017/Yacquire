import { concatenateUint8Arrays } from "../../common/helpers.js";
import { Client } from "../client.js";

export class BotClient extends Client {
    constructor(clientId: number) {
        super(clientId, () => {});
    }

    // We Intercept messages to the browser and will send them to my bot
    sendMessage(message: Uint8Array) {
        // Attempt to decode the Uint8Array message as a UTF-8 string for logging
        try {
            const decoded = new TextDecoder("utf-8").decode(message);
            console.log("Decoded message:", decoded);
        } catch (e) {
            console.log("Could not decode message, raw bytes:", message);
        }
        super.sendMessage(message);
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
