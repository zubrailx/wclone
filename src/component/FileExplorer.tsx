import { For, createSignal } from "solid-js";
import { DriveFile } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";

function FileExplorer() {
  const [ctx, _] = useDriveCtx();
  const [files, changeFiles] = createSignal<DriveFile[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");

  async function handleListClick() {
    changeFiles(await ctx.ls(10, query()));
  }

  return (
    <>
      <div>
        <button id="list_files_button" onClick={handleListClick}>List files</button>
        <div id="content">
          <table class="driveList">
            <For each={files()}>{(file, i) =>
              <tr>
                <td>{file.getName()}</td>
                <td>{file.getCreatedTime().toLocaleString()}</td>
                <td>{file.getMimeType().toLocaleString()}</td>
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
