import { For, createSignal } from "solid-js";
import { File, listFiles } from "../backend/gdrive.js";
import { encrypt, decrypt } from "../cypher/aes.js";

function FileExplorer() {
  const [files, changeFiles] = createSignal<File[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");

  async function handleListClick() {
    changeFiles(await listFiles(10, query()));
  }

  return (
    <>
      <div>
        <button id="list_files_button" onClick={handleListClick}>List files</button>
        <div id="content">
          <table class="driveList">
            <For each={files()}>{(file, i) =>
              <tr>
                <td>{file.name}</td>
                <td>{file.createdTime.toLocaleString()}</td>
              </tr>
            }</For>
          </table>
        </div>
        <form class='upload'>
          <div>
            <input type="file" name="uploadFile" required />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    </>
  )

}

export default FileExplorer
