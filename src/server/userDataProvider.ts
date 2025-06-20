import CryptoJS from "crypto-js";
import { PB_MessageToClient_LoginLogout_ResponseCode } from "../common/pb.js";

export interface UserDataProvider {
    createUser(
        username: string,
        password: string,
    ): Promise<UserDataProviderResponse>;
    lookupUser(username: string): Promise<UserDataProviderResponse>;
}

export class UserDataProviderResponse {
    constructor(
        public userData: UserData | undefined,
        public errorCode:
            | PB_MessageToClient_LoginLogout_ResponseCode
            | undefined,
    ) {}
}

export interface UserData {
    username: string;
    userId: number;
    passwordHash: string;
    verifyPassword(password: string): boolean;
    verifyToken(token: string): boolean;
}

export class TestUserDataProvider implements UserDataProvider {
    nextUserId = 1;
    usernameToUserData = new Map<string, TestUserData>();

    constructor() {
        this.createUser("andrew", "password");
        this.createUser("natasha", "password");
        this.createUser("isaiah", "password");
        this.createUser("elijah", "password");
        this.createUser("samuel", "password");
        this.createUser("anna", "password");
        this.createUser("dave", "password");
        this.createUser("lindsey", "password");
        this.createUser("elias", "password");
        this.createUser("amos", "password");
        this.createUser("john", "password");
        this.createUser("lisa", "password");
        this.createUser("jonah", "password");
        this.createUser("ethan", "password");
        this.createUser("luke", "password");
        this.createUser("steve", "password");
        this.createUser("allison", "password");
        this.createUser("dennis", "password");
        this.createUser("axel", "password");
        this.createUser("gary", "password");

        this.createUser("idiot", "password");
        this.createUser("idiot1", "password");
        this.createUser("idiot2", "password");
        this.createUser("idiot3", "password");
        this.createUser("idiot4", "password");
        this.createUser("idiot5", "password");
        this.createUser("idiot6", "password");
    }

    async createUser(username: string, password: string) {
        if (username === "createUser error") {
            return new UserDataProviderResponse(
                undefined,
                PB_MessageToClient_LoginLogout_ResponseCode.GENERIC_ERROR,
            );
        }

        if (this.usernameToUserData.has(username)) {
            return new UserDataProviderResponse(
                undefined,
                PB_MessageToClient_LoginLogout_ResponseCode.USER_EXISTS,
            );
        }

        const userId = this.nextUserId++;
        const userData = new TestUserData(
            username,
            userId,
            getPasswordHash(username, password),
        );
        this.usernameToUserData.set(username, userData);

        return new UserDataProviderResponse(userData, undefined);
    }

    async lookupUser(username: string) {
        if (username === "lookupUser error") {
            return new UserDataProviderResponse(
                undefined,
                PB_MessageToClient_LoginLogout_ResponseCode.GENERIC_ERROR,
            );
        }

        return new UserDataProviderResponse(
            this.usernameToUserData.get(username),
            undefined,
        );
    }
}

export class TestUserData implements UserData {
    constructor(
        public username: string,
        public userId: number,
        public passwordHash: string,
    ) {}

    verifyPassword(password: string) {
        return getPasswordHash(this.username, password) === this.passwordHash;
    }

    verifyToken(token: string) {
        return token === this.passwordHash;
    }
}

export function getPasswordHash(username: string, password: string) {
    return CryptoJS.SHA256("acquire " + username + " " + password).toString();
}
