import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import SwiperSL from "./components/swiper";
import mineApi from "@src/apis/mine";

import "./index.scss";

function DailyRewards() {
  const [dayType, setDayType] = useState("today");
  const [currentSelected, setCurrentSelected] = useState<any>({});
  const [showSelect, setShowSelect] = useState(false);
  const [selectList, setSelectList] = useState<any[]>([]);
  const [rankingList, setRankingList] = useState<any[]>([]);
  const [mineInfo, setMineInfo] = useState<any>({});

  useEffect(() => {
    getRankActiveList();
  }, [dayType]);

  useEffect(() => {
    if (currentSelected.rule_name) {
      getRankActiveUserList();
    }
  }, [currentSelected]);

  const getRankActiveList = async () => {
    const res = await mineApi.getRankActiveList();
    if (res.code === 200) {
      setSelectList(res.data);
      setCurrentSelected(res.data[0]);
    }
  };

  const getRankActiveUserList = async () => {
    const params = {
      id: currentSelected.rule_id,
      day: dayType,
      page: 1,
    };
    const res = await mineApi.getRankActiveUserList(params);
    if (res.code === 200) {
      setRankingList(res.list);
      setMineInfo(res.mine);
    }
  };

  return (
    <div className="rewards-wrap">
      <NavBar
        fixed={true}
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        流水奖励
      </NavBar>
      <div
        className="toggle"
        onClick={() => {
          if (dayType === "today") {
            setDayType("yesterday");
          } else {
            setDayType("today");
          }
        }}
      >
        {dayType === "today" ? "昨日" : "今日"}
      </div>
      <div className="header-wrap">
        <div className="select-wrap">
          <div className="selected" onClick={() => setShowSelect(!showSelect)}>
            <Image
              className="selected-bg"
              src={require("./../../assets/icon/规则@2x.png")}
              mode="heightFix"
            />
            <span className="selected-span">{currentSelected.rule_name}</span>
          </div>
          <div className={classNames("selected-list", showSelect && "active")}>
            {selectList.map((item) => (
              <div
                className="selected-item"
                key={item.rule_name}
                onClick={() => {
                  console.log(item);
                  setShowSelect(false);
                  setCurrentSelected(item);
                }}
              >
                {item.rule_name}
              </div>
            ))}
          </div>
        </div>
        <div className="title-wrap">
          <div className="title">{currentSelected.rule_desc}</div>
        </div>
      </div>
      <div className="reword-wrap">
        <Image
          className="bg"
          src={"https://api.zeecheese.top/assets/icon/title_bg@2x.png"}
          mode="heightFix"
        />
        <div className="reword">
          <span>送真气值及其他奖励</span>
        </div>
      </div>
      <div className="users-wrap">
        <div className="explain">
          抽取当日达标用户送
          {currentSelected.rule_reward?.point_arr
            .map((item) => `${item.num}个${item.point}`)
            .join(",")}
          真气值，或抽取当日达标用户送
          {currentSelected.rule_reward?.kit_arr
            .map((item) => item.name)
            .join(",")}
        </div>
        <SwiperSL swiperData={currentSelected.rule_reward?.kit_arr}></SwiperSL>
        <div className="users">
          {currentSelected[dayType + "_rank_user"] &&
            currentSelected[dayType + "_rank_user"].win_user_ids.map((item) => (
              <span key={item} className="user">
                {item}
              </span>
            ))}
        </div>
      </div>
      <div className="ranking-list">
        {rankingList.length
          ? rankingList.map((item, index) => (
              <div className="ranking-item">
                <div className="number">
                  {index === 0 && (
                    <Image
                      className="icon"
                      src={require("./../../assets/icon/01@2x.png")}
                    ></Image>
                  )}
                  {index === 1 && (
                    <Image
                      className="icon"
                      src={require("./../../assets/icon/02@2x.png")}
                    ></Image>
                  )}
                  {index === 2 && (
                    <Image
                      className="icon"
                      src={require("./../../assets/icon/03@2x.png")}
                    ></Image>
                  )}
                  {[0, 1, 2].includes(index) ? null : <span>{index + 1}</span>}
                </div>
                <div className="personal-info">
                  <Image className="avatar" src={item.user.avatar} />
                  <div className="container">
                    <div className="name">{item.user?.nickname}</div>
                    <div className="tags">
                      <span className="tag">{item.user?.user_level.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      <div className="personal-number">
        <div className="number">{mineInfo.rank}</div>
        <div className="personal-info">
          <Image className="avatar" src={mineInfo.user?.avatar} />
          <div className="container">
            <div className="name">{mineInfo.user?.nickname}</div>
            <div className="tags">
              <span className="tag">{mineInfo.user?.user_level.name}</span>
            </div>
          </div>
        </div>
        <div className="money">总消费：{Number(mineInfo.ls).toFixed(0)}元</div>
      </div>
    </div>
  );
}

export default DailyRewards;
