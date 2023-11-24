import { Setter } from "solid-js";
import { EncryptableLocalFile, fromFile } from "../../localfile.js";
import { Algorithm, LocalFileEncryptor } from "../../cypher/base.js";
import { DriveRemote } from "../../remote/base.js";
import { useApiContext } from "./../DriveProvider.jsx";
import { DriveFileMeta } from "../../api/base.js";

type Props = {
  curRemote: DriveRemote | undefined,
  cypher: LocalFileEncryptor,
  pwd: DriveFileMeta[],
  isAutoEncr: boolean,
  setIsAutoEncr: Setter<boolean>,
}

function LocalExplorer(props: Props) {
  const [_, { getRequiredApi }] = useApiContext();

  let inputFile: HTMLInputElement | undefined;

  // Files
  async function inputFileOnChange(event: any) {
    const encrFiles = []
    const fileList: FileList = event.target.files;
    for (const file of fileList) {
      const newFile = new EncryptableLocalFile(await fromFile(file), Algorithm.NONE_OR_UNK);
      encrFiles.push(newFile);
    }
    uploadAllFiles(encrFiles);
  }

  async function processAutoEncryption(file: EncryptableLocalFile) {
    let file1;
    if (props.isAutoEncr) {
      file1 = await props.cypher.encryptFile(file);
    } else {
      file1 = file;
    }
    return file1;
  }

  async function uploadAllFiles(files: EncryptableLocalFile[]) {
    if (props.curRemote !== undefined) {
      getRequiredApi(props.curRemote)
        .then(async (api) => {
          for (const file of files) {
            processAutoEncryption(file)
              .then(file => api.upload(props.curRemote!, props.pwd, file))
              .then((res) => {
                console.log(res);
              }).catch((e) => {
                alert(JSON.stringify(e));
              })
          }
        })
    }
  }

  function checkAutoEncrOnChange() {
    props.setIsAutoEncr((val) => !val);
  }

  return (
    <div class='localfile'>
      <h3>Encryption</h3>
      <div>
        <input type="checkbox" checked={props.isAutoEncr} onChange={checkAutoEncrOnChange} />
        <span>
          Enable encryption
        </span>
      </div>
      <h3>Execution</h3>
      <div>
        <input type="file" ref={inputFile} onChange={inputFileOnChange} value="Upload" multiple />
      </div>
    </div>
  )
}

export default LocalExplorer
