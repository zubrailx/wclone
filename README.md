# wclone

Web-application to access different remote file storages in an identical manner. Only frontend server required.

Currently supported backends:

* Google Drive

Currently supported operations:

* List
* Change directory
* Remove
* Upload
* Encryption (AES)

Stores configuration in localStorage.

## TODO

### Won't

- [ ] ~~Create wrapper on content to store information about used algorithm (or store it in content)~~. Not compatible.

### Might

- [ ] Try using streaming algorithm without loading file into the browser. May be hard. Need researching, also could have problems with api.

### Could

- [x] Add selection for API backend. Example: create menu list where to select API and another page could be rendered.
- [x] Add selection for Crypto algorithm. Example: create popup window with algorithms to select with relevant parameters.
- [x] Use localStorage for remotes and algorithms
- [x] Fix some bugs that are relevant to coordinate positioning. Because of it context menu sometimes doesn't open.

