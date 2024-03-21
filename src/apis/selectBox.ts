import request from "@src/utils/request";

const getBoxList = (params) => request.post("v2/getboxlistbysearch", params);

const getBoxListPage = (params) => request.post("v2/getboxlistbypage", params);

export default {
  getBoxList,
  getBoxListPage,
};
