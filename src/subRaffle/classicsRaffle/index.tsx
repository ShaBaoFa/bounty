import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import Taro, { useDidShow, useRouter, useUnload } from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import Popup from "@src/components/popup";
import Button from "@src/components/Button";
import CountDown from "@src/components/countDown";
import CartGoodsCard from "./components/CartGoodsCard";
import PaymentPopup from "@src/components/PaymentPopup";
import DetailPopup from "@src/components/DetailPopup";
import ResultCard from "@src/components/ResultCard";
import Dialog from "@src/components/Dialog";

import RaffleApi from "@src/apis/raffle";
import { explainMap } from "./constants";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";
import classNames from "classnames";

function MatchlessRaffle() {
  const { params } = useRouter();
  const countDownRef = useRef({
    startTime: Date.now(),
    endTime: Date.now() + 10 * 60 * 1000,
  });
  const [balanceInfo, setBalanceInfo] = useState<any>({});
  const [couponList, setCouponList] = useState<any[]>([]);
  const [raffleNumber, setRaffleNumber] = useState(1);

  const [boxInfo, setBoxInfo] = useState<any>({});
  const [dataList, setDataList] = useState<any>({});
  const [currentNum, setCurrentNum] = useState(1);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueLength, setQueueLength] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [recordList, setRecordList] = useState<any[]>([]);
  const [kitsList, setKitsList] = useState<any[]>([]);
  const [consumptionList, setConsumptionList] = useState<any[]>([]);

  const [isOverview, setIsOverView] = useState(true);
  const [showBasic, setShowBasic] = useState(false);
  const [showRecordBasic, setShowRecordBasic] = useState(false);
  const [showConsumptionBasic, setShowConsumptionBasic] = useState(false);
  const [showPaymentBasic, setShowPaymentBasic] = useState(false);
  const [showCouponBasic, setShowCouponBasic] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>({});
  const [showDetailBasic, setShowDetailBasic] = useState(false);
  const [showResultBasic, setShowResultBasic] = useState(false);
  const [resultList, setResultList] = useState<any[]>([]);
  const [defaultValue, setDefaultValue] = useState(0);

  useEffect(() => {
    setCurrentNum(raffleStore.boxNo);
    getRaffleDetail("", raffleStore.boxNo);
  }, [raffleStore.boxNo]);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setTimeout(() => {
      raffleStore.setBoxId(params.id);
      raffleStore.setBoxType(params.type || "一番赏");
      raffleStore.setBoxNo(params.No);
    }, 1200);
  }, [params.id]);

  useDidShow(() => {
    getCouponList();
  });

  useUnload(() => {
    raffleStore.setBoxNo(1);
  });

  Taro.useShareAppMessage((res) => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    // return {
    //   title: "SHOW潮赏|潮玩手办一番赏,第" + No.value + "箱,就差你一个～",
    //   path: "/moduleA/pages/goods/index?id=" + id.value + "&No=" + No.value + "&userid=" + 1,
    //   imageUrl: url.value + box.value.banner,
    // };
    return {
      title: "SHOW潮赏|潮玩手办一番赏,第" + boxInfo.No + "箱,就差你一个～",
      path:
        "/subRaffle/classicsRaffle/index?id=" +
        boxInfo.box_id +
        "&No=" +
        boxInfo.No +
        "&type=" +
        raffleStore.boxType +
        "&userid=" +
        1,
      imageUrl: boxInfo.banner,
    };
  });

  const getRaffleDetail = async (action, num?) => {
    const res = await RaffleApi.getPlaysRandDetails({
      No: num || currentNum,
      action: action,
      id: raffleStore.boxId,
      type: raffleStore.boxType,
    });
    if (res.code === 200) {
      const data = res.list;
      setCurrentNum(res.No);
      setBalanceInfo({
        point: res.point,
        taid: res.taid,
        price: data.price,
      });
      setBoxInfo({
        ...boxInfo,
        price: data.price,
        banner: data.banner,
        box_id: data.id,
        play_type: data.play_type,
        No: res.No,
        residue_kit: res.residue_kit,
        all_kits: res.all_kits,
        box_num: data.box_num,
        lock_num: res.lock_num,
        is_lock: res.is_lock,
        timer: res.timer,
        is_can_show: res.is_can_show,
        mine_bd_num: res.mine_bd_num,
        empty_num: res.empty_num,
      });
      setDataList(data);
      setKitsList(data.kits);
      getCsQueue(res.No, data);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const getCouponList = async () => {
    const res = await RaffleApi.getCouponList({
      page: 1,
      plays_id: raffleStore.boxId,
    });
    if (res.code === 200) {
      setCouponList(res.list);
      setSelectedCoupon({});
    }
  };

  const getConsumptionList = async () => {
    const res = await RaffleApi.getConsumptionList({
      No: currentNum,
      box: dataList,
    });
    if (res.code === 200) {
      setShowConsumptionBasic(true);
      setConsumptionList(res.list);
    }
  };

  const getRewardRecord = async () => {
    const res = await RaffleApi.getRewardRecord({
      No: currentNum,
      box: dataList,
    });
    if (res.code === 200) {
      setShowRecordBasic(true);
      setRecordList(res.list);
    }
  };

  const getCsQueue = async (No, dataList) => {
    const res = await RaffleApi.getCsQueue({
      No: No,
      box: dataList,
    });
    if (res.code === 200) {
      if (res.is_in_quene) {
        setIsInQueue(true);
        setQueueLength({
          length: 0,
          is_in_quene: true,
        });
        countDownRef.current.startTime = Date.now();
        countDownRef.current.endTime = Date.now() + res.timer * 1000;
      } else {
        setIsInQueue(false);
        if (res.is_in_quene) {
          setQueueLength({
            length: res.queue_index,
            is_in_quene: true,
          });
        } else {
          setQueueLength({
            length: res.data.length,
            is_in_quene: false,
          });
        }
      }
    }
  };

  const joinQueue = async () => {
    const res = await RaffleApi.joinQueue({
      No: boxInfo.No,
      box: dataList,
    });
    if (res.code === 200) {
      countDownRef.current.startTime = Date.now();
      countDownRef.current.endTime = Date.now() + res.timer * 1000;
      setIsInQueue(true);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const dequeue = async () => {
    const res = await RaffleApi.dequeue({
      No: boxInfo.No,
      box: dataList,
    });
    if (res.code === 200) {
      setIsInQueue(false);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const changePaymentPopup = (number) => {
    if (!isInQueue && raffleStore.boxType !== "擂台赏") {
      setVisible(true);
    } else {
      if (number === "all") {
        number = boxInfo.residue_kit;
      }
      if (boxInfo.residue_kit < number) {
        Taro.showToast({
          icon: "error",
          title: "赏品剩余少于当前抽数，请重新选择",
        });
        return;
      }
      setRaffleNumber(number);
      setShowPaymentBasic(true);
    }
  };

  const toLuckDraw = async (isZhenQi, zhenQi, isJump) => {
    const res = await RaffleApi.luckDraw({
      box_id: boxInfo.No,
      coupon: selectedCoupon.id ? selectedCoupon : undefined,
      kits: dataList.kits,
      num: raffleNumber,
      plays_id: raffleStore.boxId,
      point: isZhenQi ? zhenQi : 0,
      type: raffleStore.boxType,
      play_type: boxInfo.play_type,
      timestamp: new Date().getTime(),
    });
    if (res.code === 200) {
      getRaffleDetail("");
      getCouponList();
      setResultList(res.list);
      raffleStore.setSkipStatus(isJump);
      setShowPaymentBasic(false);
      if (isJump || raffleStore.boxType === "擂台赏") {
        setShowResultBasic(true);
      } else {
        raffleStore.setResultList(res.list);
        Taro.navigateTo({
          url: "/subRaffle/cardRaffle/index",
        });
      }
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const gotoSelectBox = () => {
    Taro.navigateTo({
      url: `/subPages/selectBox/index`,
    });
  };

  return (
    <div className="matchlessRaffle-wrap">
      <NavBar
        fixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        {dataList.name}
      </NavBar>
      <div className="header-wrap">
        <Image className="bg" src={boxInfo.banner} mode="aspectFill"></Image>
        {raffleStore.boxType === "擂台赏" ? (
          <Image
            className="btn-bg"
            src={"https://api.zeecheese.top/assets/icon/raffle-bg@2x.png"}
          ></Image>
        ) : (
          <Image
            className="btn-bg"
            src={"https://api.zeecheese.top/assets/icon/raffle-bg@2x.png"}
          ></Image>
        )}

        {raffleStore.boxType === "擂台赏" && (
          <Image
            className="pk"
            src={"https://api.zeecheese.top/assets/icon/pk@2x.png"}
          ></Image>
        )}
        <div className="consumption-list" onClick={() => getConsumptionList()}>
          消费榜
          <Image
            className="bg"
            src={require("./../../assets/icon/消费榜@2x.png")}
          ></Image>
        </div>
        <div className="explain" onClick={() => setShowBasic(true)}>
          购买说明
          <Image
            className="bg"
            src={require("./../../assets/icon/goumai@2x.png")}
          ></Image>
        </div>
        {raffleStore.boxType !== "擂台赏" && queueLength.length > 0 && (
          <div className="setinterval">
            倒计时
            <div className="queue-number">您前面还有{queueLength.length}人</div>
            <Image
              className="bg"
              src={"https://api.zeecheese.top/assets/icon/倒计时@2x.png"}
            ></Image>
          </div>
        )}
        {raffleStore.boxType !== "擂台赏" && isInQueue && (
          <div className="setinterval">
            倒计时
            <div className="time-shadow">
              <CountDown
                startTime={countDownRef.current.startTime}
                endTime={countDownRef.current.endTime}
                millisecond
                onEnd={() => setIsInQueue(false)}
                format="mm:ss:SS"
              />
            </div>
            <Image
              className="bg"
              src={"https://api.zeecheese.top/assets/icon/倒计时@2x.png"}
            ></Image>
          </div>
        )}
        <div
          className="refresh"
          onClick={() => {
            getRaffleDetail("");
          }}
        >
          刷新
          <Image
            className="bg"
            src={require("./../../assets/icon/刷新@2x.png")}
          ></Image>
        </div>
        {raffleStore.boxType !== "擂台赏" && (
          <div
            className="join"
            onClick={() => {
              if (!isInQueue) {
                joinQueue();
              } else {
                dequeue();
              }
            }}
          >
            {isInQueue ? (
              <Image
                className="bg"
                src={require("./../../assets/icon/退出@2x.png")}
              ></Image>
            ) : (
              <Image
                className="bg"
                src={require("./../../assets/icon/全收button@2x.png")}
              ></Image>
            )}
          </div>
        )}
      </div>
      <div className="tabs-wrap">
        <div className="record" onClick={() => getRewardRecord()}>
          中赏记录
          <Image
            className="bg"
            src={require("./../../assets/icon/中赏记录@2x.png")}
          ></Image>
        </div>
        <div className="tabs">
          <div className="bg">
            {isOverview ? (
              <Image
                className="bg"
                src={require("./../../assets/icon/赏品一览@2x.png")}
              ></Image>
            ) : (
              <Image
                className="bg"
                src={require("./../../assets/icon/余额@2x.png")}
              ></Image>
            )}
          </div>
          <div className="overview" onClick={() => setIsOverView(true)}>
            商品一览
          </div>
          <div className="residual" onClick={() => setIsOverView(false)}>
            商品余量
          </div>
        </div>
        <div
          className="replace"
          onClick={() => {
            gotoSelectBox();
          }}
        >
          换箱
        </div>
      </div>
      <div className="number-wrap">
        <div className="prev" onClick={() => getRaffleDetail("prev")}>
          上一箱
        </div>
        <div className="number">
          <span className="title">第</span>
          <span className="extant">{boxInfo.No}</span>
          <span className="symbol">/</span>
          <span className="total">{boxInfo.box_num}</span>
          <span className="unit">箱</span>
          <span className="title">商品余量</span>
          <span className="extant">{boxInfo.residue_kit}</span>
          <span className="symbol">/</span>
          <span className="total">{boxInfo.all_kits}</span>
        </div>
        <div className="next" onClick={() => getRaffleDetail("next")}>
          下一箱
        </div>
      </div>
      <div className="list-wrap">
        {isOverview ? (
          <div className="overview-list">
            {kitsList.map((item, index) => (
              <CartGoodsCard
                className="item"
                info={item}
                boxInfo={boxInfo}
                onClick={() => {
                  setDefaultValue(index);
                  setShowDetailBasic(true);
                }}
              ></CartGoodsCard>
            ))}
          </div>
        ) : (
          <div className="residual-list">
            {kitsList.map((item, index) => (
              <div
                className={classNames(
                  "item",
                  item.total - item.ex_num <= 0 && "disabled"
                )}
              >
                <span className="class">{item.grade}</span>
                <span className="segment">----------</span>
                <span className="number">
                  {item.total - item.ex_num}/{item.total}
                </span>
                <span className="chance">
                  {item.rate_desc.includes("赠") ? "" : "概率："}
                  {item.rate_desc}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="footer">
        {raffleStore.boxType === "擂台赏" && (
          <div className="top only-one">
            <div
              className="one-round"
              onClick={() => changePaymentPopup(1)}
            ></div>
          </div>
        )}
        {raffleStore.boxType !== "擂台赏" && (
          <>
            <div className="top">
              <div
                className="one-round"
                onClick={() => changePaymentPopup(1)}
              ></div>
              <div
                className="three-round"
                onClick={() => changePaymentPopup(3)}
              >
                {isInQueue && (
                  <Image
                    className="time"
                    src={require("../../assets/icon/+10@2x.png")}
                  ></Image>
                )}
              </div>
              <div className="five-round" onClick={() => changePaymentPopup(5)}>
                {isInQueue && (
                  <Image
                    className="time"
                    src={require("../../assets/icon/+20@2x.png")}
                  ></Image>
                )}
              </div>
            </div>
            <div className="bottom">
              <div className="ten-round" onClick={() => changePaymentPopup(10)}>
                {isInQueue && (
                  <Image
                    className="time"
                    src={require("../../assets/icon/+30@2x.png")}
                  ></Image>
                )}
              </div>
              <div
                className="collect-all"
                onClick={() => changePaymentPopup("all")}
              ></div>
            </div>
          </>
        )}
      </div>
      <Dialog
        title="温馨提示"
        visible={visible}
        confirmText="收到"
        hideCancelButton
        onConfirm={() => setVisible(false)}
      >
        请先加入队列
      </Dialog>
      <PaymentPopup
        visible={showPaymentBasic}
        raffleName={dataList.name}
        raffleType={raffleStore.boxType}
        balanceInfo={balanceInfo}
        couponInfo={selectedCoupon}
        couponList={couponList}
        raffleNumber={raffleNumber}
        onClose={() => {
          setShowPaymentBasic(false);
        }}
        onPopupClick={() => {
          setShowCouponBasic(true);
        }}
        onChooseZhenQi={() => {
          setSelectedCoupon({});
        }}
        onConfirmPayment={(isZhenQi, zhenQi, isJumo) => {
          toLuckDraw(isZhenQi, zhenQi, isJumo);
        }}
      ></PaymentPopup>

      <Popup
        visible={showCouponBasic}
        isRenderTitle={false}
        isRenderFooter={false}
        position="bottom"
        round
        onClose={() => setShowCouponBasic(false)}
      >
        <div className="coupon-title">选择优惠券</div>
        <div className="coupon-list">
          {couponList.map((item) => (
            <div
              className="coupon-item"
              onClick={() => {
                setSelectedCoupon(item);
                setShowCouponBasic(false);
              }}
            >
              <Image
                className="bg"
                src={"https://api.zeecheese.top/assets/icon/coupon.png"}
              ></Image>
              <div className="money">
                <span className="unit">¥</span>
                {item.value}
              </div>
              <div className="limit-wrap">
                <div className="limit">{item.description || "无门槛"}</div>
                <div className="explain">仅当前赏品可使用</div>
                <div className="time">有效期至 {item.not_after}</div>
              </div>
            </div>
          ))}
        </div>
      </Popup>
      <Popup
        visible={showBasic}
        title="购买说明"
        onClose={() => {
          setShowBasic(false);
        }}
      >
        <div className="explain-content">
          {explainMap[raffleStore.boxType || "一番赏"].map((item, index) => (
            <div className="item">
              {index + 1}、{item}
            </div>
          ))}
        </div>
      </Popup>
      <Popup
        visible={showConsumptionBasic}
        title="消费榜"
        onClose={() => {
          setShowConsumptionBasic(false);
        }}
      >
        <div className="consumption-content">
          {consumptionList.map((item) => (
            <div className="personal-info">
              <Image className="avatar" src={item.avatar} />
              <div className="container">
                <div className="name">{item.nickname}</div>
                <div className="name">冲 {item.ex_num}发</div>
              </div>
            </div>
          ))}
        </div>
      </Popup>
      <Popup
        closeable
        visible={showRecordBasic}
        title="中赏记录"
        footer={
          <>
            <Button
              className="btn"
              shape="square"
              bgColor="#ffffff"
              style={{ color: "#0b0b0b" }}
              onClick={() => {
                setShowRecordBasic(false);
              }}
            >
              关闭
            </Button>
          </>
        }
        onClose={() => {
          setShowRecordBasic(false);
        }}
      >
        <div className="record-content">
          {recordList.map((item) => (
            <div className="record-info">
              <Image className="avatar" src={item.avatar} />
              <div className="container">
                <div className="name">
                  <div className="level">
                    <Image className="icon" src={item.level?.icon} />
                    <div className="name">{item.level?.name}</div>
                  </div>
                  <div className="name">{item.nickname}</div>
                </div>
                <div className="lottery">{item.lottery_desc}</div>
                <div className="time">{item.created_at}</div>
              </div>
              <div className="number">{item.nums}</div>
            </div>
          ))}
        </div>
      </Popup>
      <DetailPopup
        closeable
        visible={showDetailBasic}
        defaultValue={defaultValue}
        swiperList={kitsList}
        onClose={() => setShowDetailBasic(false)}
      ></DetailPopup>
      <ResultCard
        visible={showResultBasic}
        recordList={resultList}
        isJump={true}
        onSetVisible={(visible) => setShowResultBasic(visible)}
      ></ResultCard>
    </div>
  );
}

export default observer(MatchlessRaffle);
