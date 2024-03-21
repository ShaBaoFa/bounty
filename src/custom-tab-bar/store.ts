import { makeAutoObservable } from "mobx";

class Store {
  activeTab: number = 0;
  constructor() {
    makeAutoObservable(this);
  }
  setActiveTab = (val) => {
    this.activeTab = val;
  };
}
export default new Store();
