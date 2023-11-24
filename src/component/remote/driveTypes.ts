import { Accessor, JSXElement, Setter } from "solid-js";
import { DriveRemote } from "../../remote/base.js";

export class DriveEntry {
  value: string
  text: string
  jsx: JSXElement;

  constructor(v: string, t: string, j: JSXElement) {
    this.value = v;
    this.text = t;
    this.jsx = j;
  }
}

export type CreateFN = CreateRemoteFN | undefined;
export type DriveElem = [Accessor<CreateFN>, Setter<CreateFN>, DriveEntry];

export type CreateRemoteFN = () => DriveRemote;
