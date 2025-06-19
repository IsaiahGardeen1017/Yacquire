import { Client } from './client.js';

export class BotClient extends Client {
  constructor(clientId: number) {
    super(clientId, () => {});
  }
}