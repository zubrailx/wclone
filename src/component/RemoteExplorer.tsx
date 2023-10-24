import { For, createSignal } from "solid-js";
import { DriveFile } from "../backend/base.js";
import { useDriveCtx } from "./DriveProvider.jsx";

function RemoteExplorer() {
  const [ctx, _] = useDriveCtx();
  const [files, changeFiles] = createSignal<DriveFile[]>([]);
  const [query, changeQuery] = createSignal("parents in 'root'");

  async function handleListClick() {
    changeFiles(await ctx.ls(10, query()));
  }

  return (
    <>
      <div class='remotefile'>
        <button onClick={handleListClick}>List files</button>
        <div class='table'>
          <For each={files()}>{(file, i) =>
            <tr class='row'>
              <td class='cell'>{file.getName()}</td>
              <td class='cell'>{file.getSize()}</td>
              <td class='cell'>{file.getCreatedTime().toLocaleString()}</td>
              <td class='cell'>{file.getMimeType().toLocaleString()}</td>
            </tr>
          }</For>
        </div>
      </div>
    </>
  )

}

export default RemoteExplorer
