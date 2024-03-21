import Taro, { useDidShow, login } from "@tarojs/taro";
import { observer } from "mobx-react";
import NavBar from "@src/components/Navbar";
import { RectRight } from "@nutui/icons-react-taro";
import { Image, Button } from "@tarojs/components";
import constants from "./constants";

import mineApi from "@src/apis/mine";
import tokenStore from "@src/store/token";

import "./index.scss";
import { useEffect, useState } from "react";

const Mine = () => {
  const [couponlist, setCouponlist] = useState(0);
  const entryClick = (item) => {
    if (item.url === "address") {
      Taro.chooseAddress({
        success: (res) => {
          console.log(res);
        },
      });
    }
    if (item.url) {
      Taro.navigateTo({
        url: item.url,
      });
    }
  };

  const gotoCoupon = () => {
    Taro.navigateTo({
      url: "/subMine/coupon/index",
    });
  };

  const gotoTdRecord = () => {
    Taro.navigateTo({
      url: `/subMine/myPulse/index`,
    });
  };

  useDidShow(() => {
    getUserinfo();
  });

  const getUserinfo = async () => {
    const res = await mineApi.getUserinfo();
    if (res.code === 200) {
      tokenStore.setUserinfo(res.data.user);
      setCouponlist(res.data.couponlist);
    }
  };

  const getPhoneNumber = async (e) => {
    const { code, encryptedData, iv } = e.detail;
    if (!code && !encryptedData) {
      return;
    }
    login({
      success: async (res) => {
        const callback = async () => {
          const jsCode = res.code;
        };
      },
      fail: function () {},
    });
  };

  return (
    <div className="mine-wrap">
      <NavBar fixed={false} back={<></>} center>
        我的
      </NavBar>
      <div className="personal-wrap">
        <div className="personal-info">
          <div className="avatar">
            <Image className="avatar-icon" src={tokenStore.userinfo.avatar} />
          </div>
          <div className="container">
            <div className="name">{tokenStore.userinfo.nickname}</div>
            <div className="tags-wrap">
              <div className="tags">
                <Image
                  className="icon"
                  src={tokenStore.userinfo.user_level?.icon}
                ></Image>
                {/* <Image
                  className="bg"
                  src={tokenStore.userinfo.user_level?.border}
                ></Image> */}

                <span className="tag">
                  {tokenStore.userinfo.user_level?.name}
                </span>
                <span style={{marginLeft: 10}} className="tag">
                  ID{tokenStore.userinfo.u_id}
                </span>
              </div>
              <div className="tags">
                <span className="tag">
                  {tokenStore.userinfo.user_level?.u_id}
                </span>
              </div>
            </div>
          </div>
        </div>
        <RectRight
          onClick={() => {
            Taro.navigateTo({
              url: "/subMine/updateuser/index",
            });
          }}
          color="#ffffff"
        ></RectRight>
      </div>
      <div className="assets-wrap">
        <div className="gas">
          <span className="number">{tokenStore.userinfo.point}</span>
        </div>
        <div
          className="pulse"
          onClick={() => {
            gotoTdRecord();
          }}
        >
          <span className="number">{tokenStore.userinfo.taid}</span>
        </div>
        <div className="coupon" onClick={() => gotoCoupon()}>
          <span className="number">{couponlist}</span>
        </div>
      </div>
      <div
        className="invite"
        onClick={() => {
          Taro.navigateTo({
            url: "/subMine/rebate/index",
          });
        }}
      >
        <Image
          className="banner"
          src={"https://api.zeecheese.top/assets/icon/banner@2x.png"}
        />
      </div>
      <div className="entry-wrap">
        {constants.entry.map((item) => (
          <div
            className="entry-item"
            key={item.icon}
            onClick={() => entryClick(item)}
          >
            <Image
              className="icon"
              src={require(`./../../assets/icon/${item.icon}.png`)}
            />
            <p className="title">{item.name}</p>
            {item.type && (
              <Button
                className={"get-btn"}
                openType="getPhoneNumber"
                onGetPhoneNumber={getPhoneNumber}
              ></Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(Mine);
