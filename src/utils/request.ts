import Taro from "@tarojs/taro";
import tokenStore from "../store/token";

const BASE_URL = "https://api.zeecheese.top/api/";
const VERSION = "taiyi1";

type Method = "GET" | "POST";

interface AjaxProps {
  url: string;
  method: Method;
  data?: any;
  header?: any;
  show?: boolean;
}

let Ajax = ({
  url,
  method,
  data = {},
  header = {},
  show = true,
}: AjaxProps): Promise<any> => {
  // 是否显示加载中
  if (
    show &&
    url !== "refreshToken" &&
    url !== "getcsqueue" &&
    url !== "luckdraw"
  ) {
    Taro.showLoading({
      title: "加载中",
      mask: true,
    });
  }

  return new Promise((resolve, reject) => {
    // 请求以及错误处理
    Taro.request({
      url: BASE_URL + url,
      data: {
        ...data,
        version: VERSION,
      },
      method: method,
      header: header,
      success: (res: Taro.request.SuccessCallbackResult) => {
        if (res.statusCode == 200) {
          return resolve(res.data);
        } else if (res.statusCode == 404) {
          Toast("404 请求页面不存在");
        } else {
          Toast(res.data.msg);
        }
        reject(res);
      },
      fail: (e) => {
        Model("服务器错误，请稍候再试 ！");
        reject(e);
      },
      complete: () => {
        if (show) {
          Taro.hideLoading();
        }
      },
    });
  });
};

let get = (url: string, data?: any, header?: any) => {
  header = header
    ? header
    : { Cookie: "JSESSIONID=" + Taro.getStorageSync("sessionId") };
  return Ajax({ url, method: "GET", data, header });
};

// 检测token是否过期
const checkToken = async () => {
  const tokeninfo = tokenStore;
  const accessToken = tokeninfo.accessToken;
  const expiredAt = tokeninfo.expiredAt;
  if (accessToken && expiredAt < new Date().getTime()) {
    try {
      return await tokeninfo.refresh();
    } catch (err) {
      return await tokeninfo.login();
    }
  }
};

let post = async (url: string, data?: any, header?: any, show = true) => {
  await checkToken();
  const tokeninfo = tokenStore;
  header = header
    ? header
    : { Cookie: "JSESSIONID=" + Taro.getStorageSync("sessionId") };
  header["Content-Type"] = "application/json";
  header["Authorization"] = tokeninfo.accessToken;
  return Ajax({ url, method: "POST", data, header, show });
};

// 不需要验证token的post请求
let mypost = (url: string, data?: any, header?: any) => {
  header = header
    ? header
    : { Cookie: "JSESSIONID=" + Taro.getStorageSync("sessionId") };
  header["Content-Type"] = "application/json";
  return Ajax({ url, method: "POST", data, header });
};

// 简单的加载提示 需要修改为加载组件
let Toast = (msg: string) => {
  Taro.showToast({
    title: msg,
    duration: 3000,
    icon: "none",
    mask: true,
  });
};

let Model = (msg: string) => {
  Taro.showModal({
    title: "提示",
    content: msg,
    showCancel: false,
  });
};

export default { get, post, mypost };
