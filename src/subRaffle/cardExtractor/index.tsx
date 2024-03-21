import Taro, {useUnload, useDidShow, useRouter} from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Image } from "@tarojs/components";
import { RectLeft } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import Popup from "@src/components/popup";
import Button from "@src/components/Button";
import PaymentPopup from "@src/components/PaymentPopup";
import DetailPopup from "@src/components/DetailPopup";
import ResultCard from "@src/components/ResultCard";

import RaffleApi from "@src/apis/raffle";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";

function CardExtractor() {
  let timer: any = null;
  const [balanceInfo, setBalanceInfo] = useState<any>({});
  const [couponList, setCouponList] = useState<any[]>([]);
  const [raffleNumber, setRaffleNumber] = useState(1);

  const [boxInfo, setBoxInfo] = useState<any>({});
  const [dataList, setDataList] = useState<any>({});
  const [currentNum, setCurrentNum] = useState(1);
  const [probabilityMap, setProbabilityMap] = useState<any>({});
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

  const { params } = useRouter();
  useEffect(() => {
    if (!params.id) {
      return;
    }
    setTimeout(() => {
      raffleStore.setBoxId(params.id);
      raffleStore.setBoxType(params.type || "拆卡机");
      raffleStore.setBoxNo(params.No);
    }, 1200);
  }, [params.id]);

  Taro.useShareAppMessage(()=>{
    return {
      title: "SHOW潮赏|潮玩手办一番赏",
      path:
          "/subRaffle/cardExtractor/index?id=" +
          boxInfo.box_id +
          "&No=" +
          boxInfo.No +
          "&type=" +
          raffleStore.boxType +
          "&userid=" +
          1
    };
  });

  useDidShow(() => {
    getCouponList();
  });

  useUnload(() => {
    raffleStore.setBoxNo(1);
  });

  const getRaffleDetail = async () => {
    const res = await RaffleApi.getPlaysRandDetails({
      id: raffleStore.boxId,
      type: "拆卡机",
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
      setKitsList(data.kits);
      regrouping(data.kits);
      computedProbability(data.kits);
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
    let trynum = Taro.getStorageSync('cardExtractortrynum'+ new Date().getDate())
    if (number === "try" ) {
      if (trynum > 5) {
        Taro.showToast({
          title: '试玩次数不足'
        })
        return;
      } else {

        trynum = trynum * 1 + 1
        Taro.setStorageSync('cardExtractortrynum'+ new Date().getDate(),trynum)
        var kitdata = JSON.parse(JSON.stringify(kitsList[Math.floor((Math.random() * kitsList.length))]))
        kitdata.name = 'No.[' + kitdata.name + ']'
        raffleStore.setResultList([
          {
            isTry: true,
            // 随机从kitsList取一个
            kit: kitdata
          },
        ]);

        Taro.navigateTo({
          url: "/subRaffle/clipCardRaffle/index",
        });
        return;
      }


    }
    setRaffleNumber(number);
    setShowPaymentBasic(true);
  };

  const toLuckDraw = async (isZhenQi, zhenQi, isJump) => {
    const res = await RaffleApi.luckDraw({
      box_id: boxInfo.box_id,
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
          url: "/subRaffle/clipCardRaffle/index",
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
    <div>
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        拆卡机
      </NavBar>

      <div className="card-extractor-wrap">
        <div className="extractor-bg">
          <div
            className={classNames("light-wrap top", lightActive && "active")}
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
          <div
            className={classNames("light-wrap center", lightActive && "active")}
          >
            <div className="light-item"></div>
            <div className="light-item"></div>
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
          <Image
            className="bg"
            src={"https://api.zeecheese.top/assets/icon/抽卡机@2x.png"}
            mode="widthFix"
          ></Image>
        </div>
        <div className="exhibition-area">
          {groupList.map((item, index) => (
            <div className="group" key={index}>
              {item.map((child, childIndex) => (
                <div
                  className="goods-item"
                  key={child.id}
                  onClick={() => {
                    setDefaultValue(index * 3 + childIndex);
                    setShowDetailBasic(true);
                  }}
                >
                  <Image className="img" src={child.image}></Image>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="probability">
          <div className="list">
            {Object.keys(probabilityMap).map((item) => (
              <div className="item">
                <span className="grade">{item}</span>&nbsp;&nbsp;
                {probabilityMap[item]}%
              </div>
            ))}
          </div>
        </div>
        <div className="refresh-btn" onClick={() => getRaffleDetail()}></div>
        <div className="explain-btn" onClick={() => setShowBasic(true)}></div>
        <div
          className="record-btn"
          onClick={() => {
            getRewardRecord();
          }}
        ></div>
        <div className="ranking-btn" onClick={() => getConsumptionList()}></div>
        <div className="prize">{boxInfo.price}元/包</div>
        <div className="operation-warp">
          <div className="btn one" onClick={() => changePaymentPopup(1)}></div>
          <div className="btn five" onClick={() => changePaymentPopup(5)}></div>
          <div className="btn ten" onClick={() => changePaymentPopup(10)}></div>
          <div className="try" onClick={() => changePaymentPopup("try")}></div>
        </div>
        <div className="ani-wrap"></div>
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

export default CardExtractor;
