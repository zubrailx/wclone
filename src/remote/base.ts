export abstract class DriveRemote {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
