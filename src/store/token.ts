import { makeAutoObservable } from "mobx";
import Taro from "@tarojs/taro";
import request from "../utils/request";
import { action, observable } from "mobx";

class TokenStore {
  tokens: any = "";
  userinfo: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  get accessToken() {
    return this.tokens.accessToken;
  }

  get getUserinfo() {
    return this.userinfo;
  }

  get expiredAt() {
    return this.tokens.expiredAt;
  }

  setToken(data: any) {
    this.tokens = data;
  }

  setUserinfo(data: any) {
    this.userinfo = data;
  }

  async refresh() {
    const rew = await request.mypost("refreshToken", "", {
      Authorization: this.tokens.accessToken,
    });
    this.tokens.accessToken = rew.access_token;
    this.tokens.expiredAt = rew.expires_in * 1000 + new Date().getTime();
  }

  async login() {
    const code = await wx.login();
    const res = await request.mypost("user_login", {
      code: code.code,
    });

    this.tokens.accessToken = res.data.token;
    this.tokens.expiredAt = res.data.expires_in * 1000 + new Date().getTime();
    // Assuming userinfo is another observable store
    // userinfo.changeinfo(res.data.user)
  }
}

const tokenStore = new TokenStore();
export default tokenStore;
