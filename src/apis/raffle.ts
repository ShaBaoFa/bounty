import request from "@src/utils/request";

const getPlaysRandDetails = (params) =>
  request.post("v2/getPlaysRandDetails", params);

const getCsQueue = (params) => request.post("v2/getcsqueue", params);

const joinQueue = (params) => request.post("v2/csaddquene", params);

const dequeue = (params) => request.post("v2/eixtquene", params);

const lockbox = (params) => request.post("v2/lockbox", params);

const backlock = (params) => request.post("v2/backlock", params);

const getCouponList = (params) =>
  request.post("v2/getusercouponlistbyid", params);

const getConsumptionList = (params) =>
  request.post("v2/getConsumptionlist", params);

const getRewardRecord = (params) => request.post("v2/getRewardrecord", params);

const luckDraw = (params) => request.post("v2/luckdraw", params);

export default {
  joinQueue,
  dequeue,
  lockbox,
  backlock,
  getPlaysRandDetails,
  getCsQueue,
  getCouponList,
  getConsumptionList,
  getRewardRecord,
  luckDraw,
};
