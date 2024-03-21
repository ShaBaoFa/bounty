import React, {useState, useRef, useEffect} from "react";
import Taro, {useDidShow, useRouter, useUnload} from "@tarojs/taro";
import {Image, ScrollView} from "@tarojs/components";
import {RectLeft} from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import CartGoodsCard from "./components/CartGoodsCard";
import CountDown from "@src/components/countDown";
import Gashapon from "./components/Gashapon";
import Popup from "@src/components/popup";
import Button from "@src/components/Button";
import PaymentPopup from "@src/components/PaymentPopup";
import DetailPopup from "@src/components/DetailPopup";
import ResultCard from "@src/components/ResultCard";
import VirtualList from "@src/components/virtuallist";

import RaffleApi from "@src/apis/raffle";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";

function MatchlessRaffle() {
  const systemInfo = Taro.getSystemInfoSync();
  const gashaponRef = useRef();
  const countDownRef = useRef({
    startTime: Date.now(),
    endTime: Date.now() + 10 * 60 * 1000,
  });
  const [listHeight] = useState(960 / systemInfo.pixelRatio);
  const [itemHeight] = useState(550 / systemInfo.pixelRatio);
  const [balanceInfo, setBalanceInfo] = useState<any>({});
  const [couponList, setCouponList] = useState<any[]>([]);
  const [raffleNumber, setRaffleNumber] = useState(1);

  const [boxInfo, setBoxInfo] = useState<any>({});
  const [dataList, setDataList] = useState<any>({});
  const [currentNum, setCurrentNum] = useState(1);
  const [isLockbox, setIsLockbox] = useState(false);
  const [recordList, setRecordList] = useState<any[]>([]);
  const [kitsList, setKitsList] = useState<any[]>([]);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [consumptionList, setConsumptionList] = useState<any[]>([]);

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

  useDidShow(() => {
    getCouponList();
  });

  useUnload(() => {
    raffleStore.setBoxNo(1);
  });

  const getRaffleDetail = async (action, num?) => {
    const res = await RaffleApi.getPlaysRandDetails({
      No: num || currentNum,
      action: action,
      id: raffleStore.boxId,
      type: raffleStore.boxType,
    });
    if (res.code === 200) {
      gashaponRef.current.handleResetCannonBall();
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
        No: res.No,
        residue_kit: res.residue_kit,
        all_kits: res.all_kits,
        box_num: data.box_num,
        lock_num: res.lock_num,
        is_lock: res.is_lock,
        timer: res.timer,
        is_can_show: res.is_can_show,
      });
      setDataList(data);
      const kits = data.kits.map((item) => ({
        ...item,
        ye_num: item.total - item.ex_num,
      }));
      setKitsList(kits);
      regrouping(kits);
      getCsQueue(res.No, data);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const regrouping = (data: any[]) => {
    let result: any[] = [];
    let chunk = 3;
    for (let i = 0, j = data.length; i < j; i += chunk) {
      result.push(data.slice(i, i + chunk));
    }
    setGroupList(result);
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
      if (res.timer > 0) {
        setIsLockbox(true);
        countDownRef.current.startTime = Date.now();
        countDownRef.current.endTime = Date.now() + res.timer * 1000;
      } else {
        setIsLockbox(false);
      }
    }
  };

  const lockbox = async () => {
    const res = await RaffleApi.lockbox({
      No: boxInfo.No,
      box: dataList,
    });
    if (res.code === 200) {
      countDownRef.current.startTime = Date.now();
      countDownRef.current.endTime = Date.now() + res.timer * 1000;
      setIsLockbox(true);
      setCouponList(res.data);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const backlock = async () => {
    const res = await RaffleApi.backlock({
      No: boxInfo.No,
      box: dataList,
    });
    if (res.code === 200) {
      setIsLockbox(false);
      setCouponList(res.data);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };

  const changePaymentPopup = (number) => {
    let trynum = Taro.getStorageSync('gashaponRaffletrynum' + new Date().getDate())

    if (number === "try") {
      if (trynum > 5) {
        Taro.showToast({
          title: '试玩次数不足'
        })
        return;
      } else {

        trynum = trynum * 1 + 1
        Taro.setStorageSync('gashaponRaffletrynum' + new Date().getDate(), trynum)
        var kitdata = JSON.parse(JSON.stringify(kitsList[Math.floor((Math.random() * kitsList.length))]))
        kitdata.name = 'No.[' + kitdata.name + ']'
        raffleStore.setResultList([
          {
            isTry: true,
            kit: kitdata,
          },
        ]);
        Taro.navigateTo({
          url: "/subRaffle/cardRaffle/index",
        });
        return;
      }
    }
    setRaffleNumber(number);
    setShowPaymentBasic(true);
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
      play_type: 0,
      timestamp: new Date().getTime(),
    });
    if (res.code === 200) {
      getRaffleDetail("");
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
            <RectLeft color="#979797"/>
          </>
        }
      >
        {dataList.name}
      </NavBar>
      <div className="header-wrap">
        <Image className="bg" src={boxInfo.banner} mode="aspectFill"></Image>
        {isLockbox && (
          <div className="setinterval">
            倒计时
            <div className="time-shadow">
              <CountDown
                startTime={countDownRef.current.startTime}
                endTime={countDownRef.current.endTime}
                millisecond
                onEnd={() => {
                  this.setState({
                    isLockbox: false,
                  });
                }}
                format="mm:ss:SS"
              />
            </div>
            <Image
              className="bg"
              src={"https://api.zeecheese.top/assets/icon/倒计时@2x.png"}
            ></Image>
          </div>
        )}
      </div>
      <Gashapon
        ref={gashaponRef}
        boxInfo={boxInfo}
        onPrev={() => getRaffleDetail("prev")}
        onNext={() => getRaffleDetail("next")}
        onShowRecord={() => getRewardRecord()}
        onShowExplain={() => setShowBasic(true)}
        onRefresh={() => getRaffleDetail("")}
        onLockbox={() => lockbox()}
        onBackLock={() => backlock()}
        onShowPayment={(number) => changePaymentPopup(number)}
      ></Gashapon>
      <div className="list-wrap">
        <VirtualList
          list={groupList}
          itemHeight={itemHeight}
          itemRender={(data: any, dataIndex: number) => (
            <div className="overview-list" key={dataIndex}>
              {data.map((child, index) => {
                return (
                  <CartGoodsCard
                    key={child.kit_id}
                    className="item"
                    info={child}
                    onClick={() => {
                      setDefaultValue(index);
                      setShowDetailBasic(true);
                    }}
                  ></CartGoodsCard>
                );
              })}
            </div>
          )}
        />
      </div>
      {/* <ScrollView className="list-wrap" scrollY>
        <div className="overview-list">
          {kitsList.map((item, index) => (
            <CartGoodsCard
              key={item.kit_id}
              className="item"
              info={item}
              onClick={() => {
                setDefaultValue(index);
                setShowDetailBasic(true);
              }}
            ></CartGoodsCard>
          ))}
        </div>
      </ScrollView> */}
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
          {["扭蛋机玩法"].map((item, index) => (
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
              <Image className="avatar" src={item.avatar}/>
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
              style={{color: "#0b0b0b"}}
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
              <Image className="avatar" src={item.avatar}/>
              <div className="container">
                <div className="name">
                  <div className="level">
                    <Image className="icon" src={item.level?.icon}/>
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

export default MatchlessRaffle;
