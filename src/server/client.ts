import { concatenateUint8Arrays } from '../common/helpers.js';
import { type User } from '../common/user.js';
import { type Room } from './room.js';

export class Client {
  room: Room | undefined;

  user: User | null = null;

  isLoggingInOrOut = false;

  constructor(
    public clientId: number,
    private actuallySendMessage: (message: Uint8Array) => void,
  ) { }

  private responseMessages: Uint8Array[] | null = null;

  /*
   * Starts batching messages to send as a single response.
   * Used to group multiple messages together before sending.
  */
  beginResponse() {
    if (!this.responseMessages) {
      this.responseMessages = [];
    }
  }

  /*
   * Ends batching and sends all batched messages at once (if any).
   * Used after beginResponse() to flush the batch.
   */
  endResponse() {
    if (this.responseMessages) {
      if (this.responseMessages.length > 0) {
        this.actuallySendMessage(concatenateUint8Arrays(this.responseMessages));
      }

      this.responseMessages = null;
    }
  }


  /*
   * Sends a message to the client.
   * If batching is active, adds to the batch; otherwise, sends immediately.
   */
  sendMessage(message: Uint8Array) {
    if (this.responseMessages) {
      this.responseMessages.push(message);
    } else {
      this.actuallySendMessage(message);
    }
  }

  connectToRoom(room: Room) {
    this.disconnectFromRoom();

    this.room = room;
    room.clientConnected(this);
  }

  disconnectFromRoom() {
    if (this.room) {
      this.room.clientDisconnected(this);
      this.room = undefined;
    }
  }

  loggedIn(user: User) {
    this.user = user;
    this.room?.clientLoggedIn(this);
  }

  loggedOut() {
    const previousUser = this.user!;
    this.user = null;
    this.room?.clientLoggedOut(this, previousUser);
  }
}
