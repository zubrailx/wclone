import { DriveRemote } from "./base.js";

class GDriveRemote extends DriveRemote {
  private clientId: string;
  private apiKey: string;
  private accessToken: string | null;

  public constructor(name: string, clientId: string, apiKey: string) {
    super(name);
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.accessToken = null;
  }

  public getClientId() {
    return this.clientId;
  }

  public getApiKey() {
    return this.apiKey;
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
  }
}

export { GDriveRemote }
