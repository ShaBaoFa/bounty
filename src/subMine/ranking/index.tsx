import { useState, useEffect } from "react";
import NavBar from "@src/components/Navbar";
import { RectLeft } from "@nutui/icons-react-taro";
import { Image } from "@tarojs/components";
import mineApi from "@src/apis/mine";

import "./index.scss";

const Ranking = () => {
  const [rankingList, setRankingList] = useState<any[]>([]);

  const [userdata, setUserdata] = useState<any>({});

  useEffect(() => {
    getRank();
  }, []);

  const getRank = async () => {
    const res = await mineApi.getRank();
    if (res.code === 200) {
      setRankingList(res.data);
      setUserdata(res.userdata);
    }
  };
  return (
    <div className="ranking-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        排行榜
      </NavBar>
      <div className="top-wrap">
        <div className="bg-wrap">
          <Image
            className="bg"
            src={"https://api.zeecheese.top/assets/icon/奖台@2x.png"}
          ></Image>
        </div>
        <div className="top-one">
          <Image
            className="icon"
            src={require("./../../assets/icon/1@2x.png")}
          ></Image>
          <Image className="avatar" src={rankingList[0]?.user.avatar}></Image>
        </div>
        <div className="top-two">
          <Image
            className="icon"
            src={require("./../../assets/icon/2@2x.png")}
          ></Image>
          <Image className="avatar" src={rankingList[1]?.user.avatar}></Image>
        </div>
        <div className="top-three">
          <Image
            className="icon"
            src={require("./../../assets/icon/3@2x.png")}
          ></Image>
          <Image className="avatar" src={rankingList[2]?.user.avatar}></Image>
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
        <div className="number">{userdata.rank}</div>
        <div className="personal-info">
          <Image className="avatar" src={userdata.user?.avatar} />
          <div className="container">
            <div className="name">{userdata.user?.nickname}</div>
            <div className="tags">
              <span className="tag">{userdata.user?.user_level.name}</span>
            </div>
          </div>
        </div>
        <div className="money">
          总消费：{Number(userdata.total_money).toFixed(0)}元
        </div>
      </div>
    </div>
  );
};

export default Ranking;
