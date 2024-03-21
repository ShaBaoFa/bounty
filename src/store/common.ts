import { makeAutoObservable } from "mobx";

class CommonStore {
  navBarHeight: any = "";

  constructor() {
    makeAutoObservable(this);
  }

  get getNavBarHeight() {
    return this.navBarHeight;
  }

  setNavBarHeight(data: any) {
    this.navBarHeight = data;
  }
}

const commonStore = new CommonStore();
export default commonStore;
