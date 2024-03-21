import request from "@src/utils/request";
const getUserinfo = () => request.post("v2/getuserinfo");

const getInventory = () => request.post("v2/getInventory");

const getusercouponandnextlevel = () =>
  request.post("v2/getusercouponandnextlevel");

const addOrder = (params) => request.post("v2/addOrder", params);

const decompose = (params) => request.post("v2/decompose", params);

const rechaege = (params) => request.post("v2/rechaege", params);

const zfbneworder = (params) => request.post("v2/zfbneworder", params);

const getrecharge = (params) => request.post("v2/getrecharge", params);

const getDailyTasks = () => request.post("v2/getDailyTasks");

const randomDice = () => request.post("v2/randomDice");

const getRank = () => request.post("v2/rank");

const getuserhistoryList = (params) =>
  request.post("v2/getuserhistoryList", params);

const getRankActiveList = () => request.post("v2/getRankActiveList");

const getRankActiveUserList = (params) =>
  request.post("v2/getRankActiveUserList", params);

const getOrderList = (params) => request.post("v2/getOrderList", params);

const getFsinfo = (params) => request.post("v2/getFsinfo", params);

const getFsinfoList = (params) => request.post("v2/getFsinfoList", params);
const submitFs = (params) => request.post("v2/fs", params);
const getFslist = (params) => request.post("v2/fslist", params);
const binduserFs = (params) => request.post("v2/binduserFs", params);

const tx = (params) => request.post("v2/tx", params);
const getusertxlist = (params) => request.post("v2/getusertxlist", params);
const updateuserinfo = (params) => request.post("v2/updateuserinfo", params);

export default {
  getUserinfo,
  getInventory,
  getusercouponandnextlevel,
  addOrder,
  decompose,
  rechaege,
  zfbneworder,
  getrecharge,
  getDailyTasks,
  randomDice,
  getRank,
  getuserhistoryList,
  getRankActiveList,
  getRankActiveUserList,
  getOrderList,
  getFsinfo,
  getFsinfoList,
  submitFs,
  getFslist,
  tx,
  getusertxlist,
  updateuserinfo,
  binduserFs,
};
