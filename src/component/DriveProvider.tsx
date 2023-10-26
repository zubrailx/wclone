import { createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { DriveAPI } from "../drive/base.js";

const DriveContext = createContext();

type Props = {
  api: any,
  children?: any
}

export function DriveProvider(props: Props) {
  const [api, setApi] = createStore(props.api);
  const driveApi = [ api, setApi ]
  
  return (
    <DriveContext.Provider value={driveApi} >
      {...props.children}
    </DriveContext.Provider>
  )
}

export function useDriveAPI(): [DriveAPI, SetStoreFunction<DriveAPI>] {
  return useContext(DriveContext) as [DriveAPI, SetStoreFunction<DriveAPI>];
}
