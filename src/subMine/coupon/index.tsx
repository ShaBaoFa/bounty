import Taro, { useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import NavBar from "@src/components/Navbar";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import mineApi from "@src/apis/mine";
import tokenStore from "@src/store/token";

import "./index.scss";

const Coupon = () => {
  const [levelInfo, setLevelInfo] = useState<any>({});
  const [level, setLevel] = useState(0);
  const [couponList, setCouponList] = useState<any[]>([]);

  useDidShow(() => {
    getUserinfo();
  });

  useEffect(() => {
    const current = (tokenStore.userinfo.use_taid * 100) / levelInfo.taid;
    setLevel(current > 100 ? 100 : current);
  }, [levelInfo]);

  const getUserinfo = async () => {
    const res = await mineApi.getusercouponandnextlevel();
    if (res.code === 200) {
      setLevelInfo({
        ...res.user_level,
        arr: res.arr || [],
      });
      setCouponList(res.list);
    }
  };

  return (
    <div className="coupon-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        我的等级
      </NavBar>
      <div className="personal-wrap">
        <div className="personal-info">
          <Image className="avatar" src={tokenStore.userinfo.avatar} />
          <div className="container">
            <div className="name">{tokenStore.userinfo.name}</div>
            <span className="name">太豆：{tokenStore.userinfo.taid}</span>
          </div>
        </div>
        <div
          className="recharge-btn"
          onClick={() => {
            Taro.navigateTo({
              url: "/subMine/recharge/index",
            });
          }}
        >
          充值
        </div>
      </div>
      <div className="vip-wrap">
        <Image
          className="bg"
          src={'https://api.zeecheese.top/assets/icon/VIP@2x.png'}
        ></Image>
        <div className="level-wrap">
          <div className="level-name">
            <Image
              className="icon"
              src={tokenStore.userinfo.user_level?.icon}
            ></Image>
            <span>{tokenStore.userinfo.user_level?.name}</span>
          </div>
          <div className="process-wrap">
            <div className="process-number">
              <span className="title">距离下一级</span>
              <span className="number">
                {tokenStore.userinfo.use_taid}/{levelInfo.taid}
              </span>
            </div>
            <div className="process">
              <div
                className="current-process"
                style={{
                  width: `${level}%`,
                }}
              ></div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="coupon">
          <div className="title">升级有优惠</div>
          <div className="explain">
            {levelInfo.arr &&
              levelInfo.arr.map((item) => item.list.name + " * " + item.num) +
                "; "}
          </div>
        </div>
      </div>
      <div className="coupon-list">
        {couponList.map((item) => (
          <div className="coupon-item">
            <Image
              className="bg"
              src={"https://api.zeecheese.top/assets/icon/coupon.png"}
            ></Image>
            <div className="money">
              <span className="unit">¥</span>
              {item.description.split("减")[1]}
            </div>
            <div className="limit-wrap">
              <div className="limit">{item.description || "无门槛"}</div>
              {/* <div className="explain">仅当前赏品可使用</div> */}
              <div className="time">有效期至 {item.not_after}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(Coupon);
