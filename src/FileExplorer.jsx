import { listFiles } from "./backend/gdrive";
import { encrypt, decrypt } from "./cypher/aes";

function FileExplorer() {
  async function handleListClick() {
    let files = await listFiles(10, "parents in 'root'");
    document.getElementById("content").innerHTML = ''
    for (let file of files) {
      document.getElementById("content").innerHTML +=
        '<p>' + JSON.stringify(file) + '</p>'
    }
  }

  return (
    <>
      <div>
        <button id="list_files_button" onClick={handleListClick}>List files</button>
        <div id="content"></div>
        <form className='upload'>
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
