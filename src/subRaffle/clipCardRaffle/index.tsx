import Taro, { useDidHide, useUnload } from "@tarojs/taro";
import React, { useState } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import ResultCard from "@src/components/ResultCard";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";

function ClipCardRaffle() {
  const [isActive, setIsActive] = useState(false);
  const [isCardActive, setIsCardActive] = useState(false);
  const [aniActive, setAniActive] = useState(false);
  const [hideAni, sethideAni] = useState(false);
  const [showResultBasic, setShowResultBasic] = useState(false);

  useUnload(() => {
    setIsCardActive(false);
    setAniActive(false);
    sethideAni(false);
    setShowResultBasic(false);
  });

  const startAni = () => {
    setTimeout(() => {
      setIsCardActive(true);
    }, 1000);
    setTimeout(() => {
      setAniActive(true);
    }, 1400);

    setTimeout(() => {
      sethideAni(true);
      setShowResultBasic(true);
    }, 1800 + 800 + raffleStore.resultList.length * 120);
  };

  return (
    <div className={classNames("clipCard-wrap")}>
      <NavBar
        fixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        抽赏结果
      </NavBar>
      {!hideAni && (
        <div className="card-holder">
          <Image
            className="ani-img"
            src="https://api.zeecheese.top/imgs/cut2.gif"
            onLoad={() => {
              startAni();
            }}
          ></Image>
        </div>
      )}
      {isCardActive && !hideAni && (
        <div className="card-ani">
          {raffleStore.resultList.map((item, index) => (
            <div
              className={classNames(
                "card-item",
                aniActive && `ani${index + 1}`
              )}
            >
              <Image className="ani-img" src={item.kit.image}></Image>
            </div>
          ))}
        </div>
      )}
      {hideAni && (
        <ResultCard
          visible={showResultBasic}
          recordList={raffleStore.resultList}
          onSetVisible={(visible) => {
            if (!visible) {
              Taro.navigateBack();
            }
            setShowResultBasic(visible);
          }}
        ></ResultCard>
      )}
    </div>
  );
}

export default observer(ClipCardRaffle);
