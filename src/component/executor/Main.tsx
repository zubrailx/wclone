import { DriveFileMeta } from "../../api/base.js";
import { Algorithm, Encryptor } from "../../cypher/base.js";
import { EncryptableLocalFile, LocalFile } from "../../localfile.js";
import { DriveRemote } from "../../remote/base.js";
import { useDriveAPIContext } from "../provider/DriveAPI.jsx"

type Props = {
  remote?: DriveRemote,
  pwd: DriveFileMeta[],
  cypher: Encryptor,
}

function Main(props: Props) {
  const [_, { getRequiredApi: getRequiredApi }] = useDriveAPIContext();

  async function uploadFilesEvent(event: any) {
    const fileList: FileList = event.target.files;
    const remote = props.remote
    if (remote != null) {
      for (const file of fileList) {
        const efile = new EncryptableLocalFile(new LocalFile(file), Algorithm.NONE);
        getRequiredApi(remote)
          .then(api => {
            api.upload(remote, props.pwd, efile);
          })
      }
    }
  }
  return (
    <div>
      <h2>Executor</h2>
      <div>
        <input id="executor-file-input" type="file" onChange={uploadFilesEvent} value="Upload" multiple />
      </div>
    </div>
  )
}

export default Main
