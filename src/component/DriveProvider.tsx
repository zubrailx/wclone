import { createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { DriveCtx } from "../backend/base.js";

const DriveContext = createContext();

export function DriveProvider(props: any) {
  const [dCtx, setDCtx] = createStore(props.ctx);
  const driveCtx = [ dCtx, setDCtx ]
  
  return (
    <DriveContext.Provider value={driveCtx} >
      {props.children}
    </DriveContext.Provider>
  )
}

export function useDriveCtx(): [DriveCtx, SetStoreFunction<DriveCtx>] {
  return useContext(DriveContext) as [DriveCtx, SetStoreFunction<DriveCtx>];
}
