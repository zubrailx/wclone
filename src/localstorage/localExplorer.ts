import { STORAGE_SECRET_DEFAULT, STORAGE_SECRET_KEY } from "./general.js";

function storageGetSecretKey() {
  let secretKey = window.localStorage.getItem(STORAGE_SECRET_KEY)

  if (secretKey == null) {
    window.localStorage.setItem(STORAGE_SECRET_KEY, STORAGE_SECRET_DEFAULT);
    secretKey = window.localStorage.getItem(STORAGE_SECRET_KEY)
  }

  return secretKey!;
}

export { storageGetSecretKey }
