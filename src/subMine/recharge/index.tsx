import { useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import classNames from "classnames";
import { observer } from "mobx-react";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image } from "@tarojs/components";
import Popup from "@src/components/popup";
import Button from "@src/components/Button";

import mineApi from "@src/apis/mine";
import tokenStore from "@src/store/token";

import "./index.scss";
import CheckBox from "@src/components/Checkbox";

const Recharge = () => {
  const [current, setCurrent] = useState(53);
  const [showPaymentBasic, setShowPaymentBasic] = useState(false);
  const [method, setMethod] = useState("wx");
  const [url, setUrl] = useState("");
  const [rechargeList, setRechargeList] = useState([
    {
      amount: 53,
      key: "53",
    },
    {
      amount: 103,
      key: "103",
    },
    {
      amount: 215,
      key: "215",
    },
    {
      amount: 501,
      key: "501",
    },
    {
      amount: 1090,
      key: "1090",
    },
    {
      amount: 3103,
      key: "3103",
    },
    {
      amount: 5375,
      key: "5375",
    },
    {
      amount: 10158,
      key: "10158",
    },
  ]);

  const zfbneworder = async () => {
    const res = await mineApi.zfbneworder({
      money: current,
    });
    if (res.code === 200) {
      setUrl(res.order);
      setShowPaymentBasic(true);
    }
  };

  const rechaege = async () => {
    const res = await mineApi.rechaege({
      money: current,
    });
    if (res.code === 200) {
      console.log(res);
    }
  };
  return (
    <div className="recharge-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        充值太豆
      </NavBar>
      <div className="balance-wrap">
        <div className="title">我的太豆</div>
        <div className="balance">
          <Image
            className="icon"
            src={require("../../assets/icon/Group 257@2x.png")}
          ></Image>
          <span className="number">{tokenStore.userinfo.taid}</span>
        </div>
        <Image
          className="bg"
          src={require("../../assets/icon/太豆@2x.png")}
        ></Image>
      </div>
      <div className="recharge">
        <div className="title">充值太豆</div>
        <div className="recharge-list">
          {rechargeList.map((item) => (
            <div
              className={classNames(
                "recharge-item",
                item.amount === current && "active"
              )}
              key={item.amount}
              onClick={() => setCurrent(item.amount)}
            >
              <Image
                className="select"
                src={require("../../assets/icon/Group 266@2x.png")}
              ></Image>
              <Image
                className="icon"
                src={require("../../assets/icon/Group 257@2x.png")}
              ></Image>
              <span className="amount">{item.amount}元</span>
            </div>
          ))}
        </div>
      </div>
      <div className="confirm">
        <Button
          className="immediately"
          shape="square"
          size="large"
          onClick={() => {
            zfbneworder();
          }}
        >
          立即充值
        </Button>
      </div>
      <Popup
        visible={showPaymentBasic}
        isRenderTitle={false}
        position="bottom"
        round
        footer={
          <>
            <Button
              className="btn"
              shape="square"
              size="large"
              bgColor="#B94641"
              isWhite={false}
              style={{ color: "#ffffff" }}
              onClick={() => {
                if (method === "wx") {
                  rechaege();
                } else {
                  Taro.setClipboardData({
                    data: url,
                    success(res) {
                      Taro.showToast({
                        icon: "success",
                        title: "复制成功",
                      });
                    },
                  });
                }
              }}
            >
              {method === "wx" ? "确认支付" : "点击复制"}
            </Button>
          </>
        }
        onClose={() => setShowPaymentBasic(false)}
      >
        <div className="payment-method">
          <div className="title">支付方式</div>
          <div className="methods">
            <div className="wx">
              <div>
                <Image
                  className="icon"
                  src={require("./../../assets/icon/微信 (1).png")}
                ></Image>
                微信
              </div>
              <CheckBox
                borderColor="#DC3A26"
                checked={method === "wx"}
                onClick={() => setMethod("wx")}
              ></CheckBox>
            </div>
            <div className="zfb">
              <div>
                <Image
                  className="icon"
                  src={require("./../../assets/icon/支付宝.png")}
                ></Image>
                支付宝
              </div>
              <CheckBox
                borderColor="#DC3A26"
                checked={method === "zfb"}
                onClick={() => {
                  setMethod("zfb");
                }}
              ></CheckBox>
            </div>
          </div>
          {method === "zfb" &&
          <div>
            <div style={{color: 'black'}}>复制以下链接—打开浏览器—粘贴链接前往进行充值</div>
            <div className="url">{url}</div>
          </div>
          }
        </div>
      </Popup>
    </div>
  );
};

export default observer(Recharge);
