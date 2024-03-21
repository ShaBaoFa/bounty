import { makeAutoObservable } from "mobx";

class RaffleStore {
  boxId = "";

  boxType = "";

  boxNo = 1;

  resultList: any[] = [];

  isSkipAni = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSkipStatus(data) {
    this.isSkipAni = data;
  }
  setBoxId(data) {
    this.boxId = data;
  }
  setBoxType(data) {
    this.boxType = data;
  }
  setBoxNo(data) {
    this.boxNo = data;
  }
  setResultList(data) {
    this.resultList = data.map((item, index) => ({
      ...item,
      index,
    }));
  }
}

const raffleStore = new RaffleStore();
export default raffleStore;
