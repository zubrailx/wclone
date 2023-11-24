import { createContext, useContext } from "solid-js";
import { produce, createStore } from "solid-js/store";
import { DriveAPI } from "../../api/base.js";
import { DriveRemote } from "../../remote/base.js";
import { GDriveRemote } from "../../remote/gdrive.js";
import { GDriveAPI } from "../../api/gdrive.js";

const context = createContext();

type Props = {
  children?: any
}

type DriveAPIContext = [
  DriveAPI[],
  {
    getRequiredApi: (remote: DriveRemote) => Promise<DriveAPI>
  }
]

function DriveAPIProvider(props: Props) {
  const [apis, setApis] = createStore<DriveAPI[]>([]);

  function getApiByClass<T extends DriveAPI>(Clazz: new () => T): T {
    const res = apis.filter((api) => api instanceof Clazz);
    if (res.length === 0) {
      const newApi = new Clazz();
      setApis(produce(apis => {
        apis.push(newApi);
      }));
      res.push(newApi);
    }
    return res[0] as T;
  }

  async function getRequiredApi(remote: DriveRemote) {
    let api;

    if (remote instanceof GDriveRemote) {
      api = getApiByClass(GDriveAPI);
    }

    console.assert(api !== undefined);

    if (!api!.isLoaded()) {
      await api!.load();
    }
    return api as DriveAPI;
  }

  const driveApis: DriveAPIContext = [
    apis,
    {
      getRequiredApi: getRequiredApi
    }
  ]

  return (
    <context.Provider value={driveApis} >
      {...props.children}
    </context.Provider>
  )
}

function useDriveAPIContext(): DriveAPIContext {
  return useContext(context) as DriveAPIContext;
}

export { DriveAPIProvider, useDriveAPIContext }
export type { DriveAPIContext }
