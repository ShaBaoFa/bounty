import { useRef, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { Image, ScrollView, CoverView, CoverImage } from "@tarojs/components";
import { throttle } from "lodash";
import HomeSwiper from "./components/homeSwiper";
import HomeTabs from "./components/homeTabs";
import GoodsCard from "@src/components/GoodsCard";
import CouponPopup from "@src/components/couponPopup";
// import Popup from "@src/components/popup";
import homeApi from "@src/apis/home";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";

const App = () => {
  const [currentTab, setCurrentTab] = useState("一番赏");
  const [showCoupon, setShowCoupon] = useState(false);
  // const [showQrCode, setShowQrCode] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [page, setPage] = useState(1);
  const [goods, setGoods] = useState<any[]>([]);

  const scrollTop = useRef(0);
  const direction = useRef("down");
  const [overlayShow, setOverlayShow] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [headerTabShow, setHeaderTabShow] = useState(false);
  const [isInfiniting, setIsInfiniting] = useState(true);
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const onScroll = throttle((event) => {
    if (event.detail.scrollTop > scrollTop.current) {
      direction.current = "down";
    } else {
      direction.current = "up";
    }
    scrollTop.current = event.detail.scrollTop;

    setOverlayOpacityFn(event.detail.scrollTop);
    setHeaderTabOpacityFn(event.detail.scrollTop);
  }, 300);

  const setOverlayOpacityFn = (top) => {
    if (direction.current === "down" && top > 50) {
      if (!overlayShow) {
        setOverlayShow(true);
      }
    }
    if (direction.current === "up" && top < 240) {
      if (top < 50 && overlayShow) {
        setOverlayShow(false);
      }
    }
    const topOpacity = top / 240 > 0.9 ? 1 : top / 240;
    setOverlayOpacity(topOpacity);
  };

  const setHeaderTabOpacityFn = (top) => {
    if (direction.current === "down" && top > 240) {
      if (!headerTabShow) {
        setHeaderTabShow(true);
      }
    }
    if (direction.current === "up" && top < 300) {
      if (top < 300 && headerTabShow) {
        setHeaderTabShow(false);
      }
    }
  };

  const loadMore = () => {
    getPlayRands();
  };

  const onRefresh = () => {
    setRefresherTriggered(true);
    setTimeout(() => {
      setRefresherTriggered(false);
    }, 1000);
  };

  const gotoRaffle = (item) => {
    raffleStore.setBoxNo(item.remaining_box_num);
    raffleStore.setBoxId(item.id);
    raffleStore.setBoxType(currentTab);
    let url = "/subRaffle/classicsRaffle/index";
    if (currentTab === "拆卡机") {
      url = "/subRaffle/cardExtractor/index";
    }
    if (currentTab === "扭蛋机") {
      url = "/subRaffle/gashaponRaffle/index";
    }
    Taro.navigateTo({
      url: `${url}`,
    });
  };

  useEffect(() => {
    getPlayRands(1);
  }, [currentTab]);

  const getPlayRands = async (currentPage?) => {
    const res = await homeApi.getPlayRands({
      type: currentTab,
      page: currentPage || page,
      limit: 10,
    });
    if (res.code === 200) {
      if ((currentPage || page) === 1) {
        setGoods([...res.list]);
      } else {
        setGoods([...goods, ...res.list]);
      }
      setPage(currentPage ? currentPage + 1 : page + 1);
      if (res.list.length === 0) {
        setHasMore(false);
        setIsInfiniting(false);
      }
    }
  };

  const previewImage = () => {
    Taro.previewImage({
      urls: [qrCode],
    });
  };

  return (
    <ScrollView
      id="scrollWrap"
      className="home-wrap"
      refresherDefaultStyle={"white"}
      refresherBackground={"rgba(0,0,0,0.2)"}
      scrollY={!showCoupon}
      scrollWithAnimation
      enableFlex
      // refresherEnabled
      // refresherTriggered={refresherTriggered}
      onScroll={(top) => {
        onScroll(top);
      }}
      lowerThreshold={50}
      upperThreshold={200}
      // onScrollToUpper={() => onRefresh}
      onScrollToLower={() => loadMore()}
    >
      <div className="header-wrap">
        {/*<div className="logo-wrap">*/}
        {/*  <Image*/}
        {/*    className="logo"*/}
        {/*    src={require("../../assets/icon/tab_icon_tycs_1@2x.png")}*/}
        {/*  />*/}
        {/*</div>*/}
        <HomeSwiper
          onShowQrCode={() => {
            previewImage();
          }}
          setQrCode={(url) => setQrCode(url)}
        ></HomeSwiper>
        {overlayShow && (
          <div className="overlay" style={{ opacity: overlayOpacity }}></div>
        )}
      </div>
      <div className="content-wrap">
        <HomeTabs onClick={(active) => setCurrentTab(active)}>
          <div
            className={classNames("header-tab", headerTabShow && "active")}
          ></div>
        </HomeTabs>
        <div className="goods-wrap">
          {goods.map((item) => {
            return (
              <GoodsCard
                className="goods-card"
                info={item}
                key={item.id}
                onClick={() => {
                  gotoRaffle(item);
                }}
              ></GoodsCard>
            );
          })}
        </div>
      </div>
      <div className="nut-infinite-bottom">
        {isInfiniting ? (
          <div className="bottom-box">{"加载中~"}</div>
        ) : (
          !hasMore && <div className="tips">{"没有更多了~"}</div>
        )}
      </div>
      <CoverView
        className="fly"
        onClick={() => {
          previewImage();
        }}
      >
        <CoverImage
          className="icon"
          src={"https://api.zeecheese.top/assets/icon/浮层@3x.png"}
        ></CoverImage>
      </CoverView>
      <CouponPopup
        visible={showCoupon}
        title="优惠券"
        footer={
          <>
            <div className="accept">
              <Image
                className="bg"
                onClick={() => {
                  setShowCoupon(false);
                }}
                src={require("./../../assets/icon/Group 1106@2x.png")}
              ></Image>
            </div>
          </>
        }
        onClose={() => {
          setShowCoupon(false);
        }}
      >
        <div className="coupon-list">
          {couponList.map((item) => (
            <div className="coupon-item">
              <Image
                className="bg"
                src={"https://api.zeecheese.top/assets/icon/coupon.png"}
              ></Image>
              <div className="money">
                <span className="unit">¥</span>999
              </div>
              <div className="limit-wrap">
                <div className="limit">无门槛</div>
                <div className="explain">仅限龙珠EX龟仙流的猛者们使用</div>
                <div className="time">有效期至 2036/01/22</div>
              </div>
            </div>
          ))}
        </div>
      </CouponPopup>
      {/* <Popup
        visible={showQrCode}
        position="center"
        isRenderFooter={false}
        isRenderTitle={false}
        onClose={() => {
          setShowQrCode(false);
        }}
      >
        <div className="qrCode">
          <Image
            className="img"
            onClick={() => {
              setShowQrCode(false);
            }}
            src={qrCode}
          ></Image>
        </div>
      </Popup> */}
    </ScrollView>
  );
};
export default App;
