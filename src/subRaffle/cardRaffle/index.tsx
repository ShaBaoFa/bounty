import React, { useState } from "react";
import classNames from "classnames";
import { useDidShow } from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import Stroll from "./Stroll";

import "./index.scss";

function RaffleCard() {
  const [isActive, setIsActive] = useState(false);
  const [prizeIsActive, setPrizeIsActive] = useState(false);
  useDidShow(() => {
    setIsActive(true);
    const timer = setTimeout(() => {
      clearTimeout(timer);
      setPrizeIsActive(true);
    }, 1300);
  });
  return (
    <div className={classNames("raffleCard-wrap", isActive && "active")}>
      <NavBar
        fixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      ></NavBar>
      <div className="bg">
        <Image
          className="img"
          src={"https://api.zeecheese.top/assets/icon/bg@2x.png"}
          mode="heightFix"
        ></Image>
      </div>
      <div className={classNames("rotate-wrap")}>
        <Image
          className="img"
          src={"https://api.zeecheese.top/assets/icon/Group%20203@2x.png"}
          mode="heightFix"
        ></Image>
      </div>
      <div className={classNames("prize-wrap", prizeIsActive && "active")}>
        <div className="rotateZ-bg">
          <Image
            className="card-img"
            src={require("./../../assets/icon/卡牌@2x.png")}
            mode="heightFix"
          ></Image>
        </div>
        <div className="rotateX-bg">
          <Image
            className="card-img"
            src={require("./../../assets/icon/卡片bg@2x.png")}
            mode="heightFix"
          ></Image>
        </div>
        <div className="prize-card">
          <Stroll></Stroll>
        </div>
      </div>
    </div>
  );
}

export default RaffleCard;
