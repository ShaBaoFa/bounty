import { makeAutoObservable } from "mobx";

class BoxStore {
  currentSelected: any = "";

  constructor() {
    makeAutoObservable(this);
  }

  get getCurrentSelected() {
    return this.currentSelected;
  }

  setToken(data: any) {
    this.currentSelected = data;
  }
}

const boxStore = new BoxStore();
export default boxStore;
