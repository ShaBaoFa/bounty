import request from "@src/utils/request";
const getCarousel = () => request.post("v2/getCarousel");
const getPlayRands = (params) => request.post("v2/getPlayRands", params);
const getPlaysRandDetails = () => request.post("v2/getPlaysRandDetails");
const getArticle = (params) => request.post("v2/getArticle", params);

const getwsbg = () => request.post("v2/getwsbg");

export default {
  getCarousel,
  getPlayRands,
  getPlaysRandDetails,
  getwsbg,
  getArticle,
};
