import { useState, useEffect } from "react";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image } from "@tarojs/components";
import Popup from "@src/components/popup";
import Dialog from "@src/components/Dialog";
import mineApi from "@src/apis/mine";

import "./index.scss";
import Taro from "@tarojs/taro";

const DailyEntrust = () => {
  const [dailyInfo, setDailyInfo] = useState<any>({});
  const [result, setResult] = useState<any>({});
  const [gifVisible, setGifVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [gifUrl, setGifUrl] = useState("https://api.zeecheese.top/imgs/tz1.gif");

  useEffect(() => {
    getDailyTasks();
  }, []);

  const getDailyTasks = async () => {
    const res = await mineApi.getDailyTasks();
    if (res.code === 200) {
      setDailyInfo(res.data);
    }
  };

  const randomDice = async () => {
    const res = await mineApi.randomDice();
    if (res.code === 200) {
      const map = {
        1: "https://api.zeecheese.top/imgs/tz1.gif",
        2: "https://api.zeecheese.top/imgs/tz2.gif",
        3: "https://api.zeecheese.top/imgs/tz3.gif",
        4: "https://api.zeecheese.top/imgs/tz4.gif",
        5: "https://api.zeecheese.top/imgs/tz5.gif",
        6: "https://api.zeecheese.top/imgs/tz6.gif",
      };
      setGifUrl(map[res.num]);
      setGifVisible(true);
      setResult(res);
      setTimeout(() => {
        setGifVisible(false);
        setDialogVisible(true);
      }, 2000);
      setTimeout(() => {
        setDialogVisible(false);
      }, 4000);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  return (
    <div className="entrust-wrap">
      <NavBar
        fixed={false}
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        每日委托
      </NavBar>
      <div className="entrust-title">
        <Image
          className="icon"
          src={"https://api.zeecheese.top/assets/icon/Group 248@2x.png"}
        ></Image>
      </div>
      <div className="entrust-list">
        <div className="entrust-item">
          <div className="card">
            <div className="icon-wrap">
              <Image
                className="icon"
                src={"https://api.zeecheese.top/assets/icon/image 159@2x.png"}
              ></Image>
            </div>
            <div className="content">
              <div className="title">
                <Image
                  className="title-img"
                  src={
                    "https://api.zeecheese.top/assets/icon/每日流水抽奖@2x.png"
                  }
                  mode="heightFix"
                ></Image>
                <span className="number">
                  ({dailyInfo.dicemsg}/{dailyInfo.znum})
                </span>
              </div>
              <div className="reward">
                奖励：{dailyInfo.dicesetting?.transaction_flow || 2000}
                流水之一次骰子
              </div>
            </div>
            <div
              className="goto-btn"
              onClick={() => {
                randomDice();
              }}
            ></div>
          </div>
        </div>
        {
          dailyInfo.lsnum > 0 ?    <div className="entrust-item">
            <div className="card">
              <div className="icon-wrap">
                <Image
                  className="icon"
                  src={"https://api.zeecheese.top/assets/icon/image 160@2x.png"}
                ></Image>
              </div>
              <div className="content">
                <div className="title">
                  <Image
                    className="title-img"
                    src={
                      "https://api.zeecheese.top/assets/icon/每日排行榜抽奖@2x.png"
                    }
                    mode="heightFix"
                  ></Image>
                </div>
                <div className="reward">奖励：每日流水可抽取奖品</div>
              </div>
              <div
                className="goto-btn"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/subPages/dailyRewards/index",
                  });
                }}
              ></div>
            </div>
          </div> : ''
        }

      </div>
      <Dialog
        title="恭喜您"
        visible={dialogVisible}
        confirmText="收到"
        hideCancelButton
        onConfirm={() => setDialogVisible(false)}
      >
        恭喜获得{result.point}真气
      </Dialog>
      {gifVisible && (
        <div className="qrCode">
          <Image
            className="img"
            onClick={() => {
              setGifVisible(false);
            }}
            src={gifUrl}
          ></Image>
        </div>
      )}
    </div>
  );
};

export default DailyEntrust;
