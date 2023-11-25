# wclone

Web-application to access different remote file storages in an identical manner. Only frontend server required.

Currently supported backends:

* Google Drive

Currently supported operations:

* List
* Change directory
* Remove
* Upload
* Encryption (AES, XOR)

Stores configuration in localStorage.


## Docker compose

### Build

```sh
docker compose build
```

### Deploy

```sh
docker compose up [-d]
```

Default port: `5573`

### Down

```sh
docker compose down [--volumes]
```
