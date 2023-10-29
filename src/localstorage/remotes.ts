import { DriveRemote } from "../remote/base.js";
import { GDriveRemote } from "../remote/gdrive.js";
import { STORAGE_REMOTES_KEY } from "./general.js";

enum DriveRemoteEnum {
  GDRIVE = 1,
}

export function storageGetRemotes(): DriveRemote[] {
  const item = window.localStorage.getItem(STORAGE_REMOTES_KEY)
  if (item === null) {
    return [];
  }
  let objs: any[] = JSON.parse(item);
  if (!Array.isArray(objs)) {
    objs = [];
  }

  return objs.map(obj => {
    switch (obj["drive_type"]) {
      case DriveRemoteEnum.GDRIVE:
        const rem = new GDriveRemote(obj.name, obj.clientId, obj.apiKey);
        rem.setAccessToken(obj.accessToken);
        return rem;
      default:
        console.assert(false, "unknown remote", obj);
    }
  }) as DriveRemote[];
}

export function storageSetRemotes(remotes: DriveRemote[]) {
  window.localStorage.setItem(STORAGE_REMOTES_KEY, JSON.stringify(remotes.map(remote => {
    const obj: any = remote;
    if (remote instanceof GDriveRemote) {
      obj["drive_type"] = DriveRemoteEnum.GDRIVE;
    }
    return obj;
  })));
}
