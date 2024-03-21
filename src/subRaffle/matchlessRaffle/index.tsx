import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import Taro, { useDidShow, useRouter, useUnload } from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import Popup from "@src/components/popup";
import Button from "@src/components/Button";
import CartGoodsCard from "./components/CartGoodsCard";
import PaymentPopup from "@src/components/PaymentPopup";
import DetailPopup from "@src/components/DetailPopup";
import ResultCard from "@src/components/ResultCard";
import Dialog from "@src/components/Dialog";

import RaffleApi from "@src/apis/raffle";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";
import classNames from "classnames";
import {Avatar, NoticeBar} from "@nutui/nutui-react-taro";

function MatchlessRaffle() {
  const [balanceInfo, setBalanceInfo] = useState<any>({});
  const [couponList, setCouponList] = useState<any[]>([]);
  const [splist,setSpList] = useState<any[]>([])

  const [raffleNumber, setRaffleNumber] = useState(1);

  const [boxInfo, setBoxInfo] = useState<any>({});
  const [dataList, setDataList] = useState<any>({});
  const [currentNum, setCurrentNum] = useState(1);
  const [probabilityMap, setProbabilityMap] = useState<any>({});
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

  const [lightActive, setLightActive] = useState(false);
  useDidShow(() => {
    setLightActive(true);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      setLightActive(!lightActive);
    }, 500);
  }, [lightActive]);

  useEffect(() => {
    setCurrentNum(raffleStore.boxNo);
    getRaffleDetail();
  }, [raffleStore.boxNo]);

  useDidShow(() => {
    getCouponList();
  });

  useUnload(() => {
    raffleStore.setBoxNo(1);
  });

  const { params } = useRouter();
  useEffect(() => {
    if (!params.id) {
      return;
    }
    setTimeout(() => {
      raffleStore.setBoxId(params.id);
      raffleStore.setBoxType(params.type || "无双赏");
      raffleStore.setBoxNo(params.No);
    }, 1200);
  }, [params.id]);

  Taro.useShareAppMessage(()=>{
    return {
      title: "SHOW潮赏|潮玩手办一番赏",
      path:
          "/subRaffle/matchlessRaffle/index?id=" +
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


  const getRaffleDetail = async () => {
    const res = await RaffleApi.getPlaysRandDetails({
      id: raffleStore.boxId,
      type: "无双赏",
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
        bd_num: data.bd_num,
        mine_bd_num: Number(res.mine_bd_num || 0),
        empty_num: res.empty_num,
      });
      setDataList(data);
      setKitsList(data.kits);
      computedProbability(data.kits);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const computedProbability = (kits) => {
    let arrrate: any[] = [];
    for (const i in kits) {
      arrrate.push({
        grade: kits[i].grade,
        rate: kits[i].rate,
      });
    }
    let map = {};
    for (let i = 0; i < arrrate.length; i++) {
      if (map[arrrate[i].grade]) {
        map[arrrate[i].grade] += parseFloat(arrrate[i].rate);
      } else {
        map[arrrate[i].grade] = parseFloat(arrrate[i].rate);
      }
    }
    setProbabilityMap(map);
  };

  const getCouponList = async () => {
    const res = await RaffleApi.getCouponList({
      page: 1,
      plays_id: raffleStore.boxId,
    });
    if (res.code === 200) {
      setCouponList(res.list);
      // console.log(res.sp_list)

      setSpList(res.sp_list.map(item=> {
        return <div style={{display: "flex",alignItems: "center"}}>
          <image src={item.avatar} style={{width: '50rpx',height: '50rpx',borderRadius: '50rpx',margin: '0 4px'}}/>
          <div>
             {item.time} 挖到 {item.lottery_desc.substring(0,5)}..
          </div>

        </div>
      }));
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
      setRecordList([...res.wslist, ...res.list]);
    }
  };

  const changePaymentPopup = (number) => {
    setRaffleNumber(number);
    setShowPaymentBasic(true);
  };

  const toLuckDraw = async (isZhenQi, zhenQi, isJump) => {
    console.log(raffleStore.boxType);
    const res = await RaffleApi.luckDraw({
      box_id: boxInfo.No,
      coupon: selectedCoupon.id ? selectedCoupon : undefined,
      kits: dataList.kits,
      num: raffleNumber,
      plays_id: raffleStore.boxId,
      point: isZhenQi ? zhenQi : 0,
      type: "无双赏",
      play_type: boxInfo.play_type,
      timestamp: new Date().getTime(),
    });
    if (res.code === 200) {
      getRaffleDetail();
      getCouponList();
      setResultList(res.list);
      raffleStore.setSkipStatus(isJump);
      setShowPaymentBasic(false);
      if (isJump) {
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
        <Image
          className="btn-bg"
          src={"https://api.zeecheese.top/assets/icon/raffle-bg@2x.png"}
        ></Image>
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
        <div
          className="refresh"
          onClick={() => {
            getRaffleDetail();
          }}
        >
          刷新
          <Image
            className="bg"
            src={require("./../../assets/icon/刷新@2x.png")}
          ></Image>
        </div>
        <div className="join" onClick={() => getRewardRecord()}>
          <Image
            className="bg"
            src={require("./../../assets/icon/中赏记录button@2x.png")}
          ></Image>
        </div>
        <div className="luckdraw_sssp">
          <NoticeBar
            direction="vertical"
            speed={10}
            duration={1000}
            list={splist}
           />
            {/*<div>*/}
            {/*  {*/}
            {/*    // splist.map((item,index)=>*/}

            {/*    <div*/}
            {/*      className="custom-item"*/}
            {/*      style={{ height: '50px', lineHeight: '50px' }}*/}
            {/*      // key={index}*/}
            {/*    >*/}
            {/*      {splist.toString()}*/}
            {/*    </div>*/}
            {/*    // )*/}
            {/*  }*/}
            {/*</div>*/}

        </div>
      </div>
      <div className="probability">
        <div className="bg">
          <Image
            className="image"
            src={require("./../../assets/icon/中奖概率BG@2x.png")}
          ></Image>
        </div>
        <div className="list">
          {Object.keys(probabilityMap).map((item) => (
            <div className="item">
              <span className="grade">{item}</span>&nbsp;&nbsp;
              {probabilityMap[item].toFixed(2)}%
            </div>
          ))}
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
                className={classNames("item", item.total <= 0 && "disabled")}
              >
                <span className="class">{item.grade}</span>
                <span className="segment">----------</span>
                <span className="number">
                  {item.ex_num}/{item.total}
                </span>
                <span className="chance">概率：{item.rate_desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="footer">
        <div className="bg">
          <Image
            className="image"
            src={"https://api.zeecheese.top/assets/icon/Group 198@2x.png"}
          ></Image>
        </div>
        <div
          className={classNames("light-wrap bottom", lightActive && "active")}
        >
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
        </div>
        <div className="top">
          <div className="one-round" onClick={() => changePaymentPopup(1)}>
            <Image
              className="image"
              src={require("./../../assets/icon/11@2x.png")}
            ></Image>
          </div>
          <div className="three-round" onClick={() => changePaymentPopup(3)}>
            <Image
              className="image"
              src={require("./../../assets/icon/31@2x.png")}
            ></Image>
          </div>
          <div className="five-round" onClick={() => changePaymentPopup(5)}>
            <Image
              className="image"
              src={require("./../../assets/icon/5@2x.png")}
            ></Image>
          </div>
          <div className="ten-round" onClick={() => changePaymentPopup(10)}>
            <Image
              className="image"
              src={require("./../../assets/icon/10@2x.png")}
            ></Image>
          </div>
        </div>
      </div>
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
          1、无限抽数，无限赏池，概率公开公正。
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
