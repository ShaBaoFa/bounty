import { useRef, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { Image, ScrollView } from "@tarojs/components";
import { throttle } from "lodash";
import HomeSwiper from "./components/homeSwiper";
import HomeTabs from "./components/homeTabs";
import GoodsCard from "@src/components/GoodsCard";
import homeApi from "@src/apis/home";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";
import classNames from "classnames";

const App = () => {
  const [currentTab, setCurrentTab] = useState("全部");
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
    raffleStore.setBoxId(item.id);
    raffleStore.setBoxType(currentTab);
    Taro.navigateTo({
      url: `/subRaffle/matchlessRaffle/index?id=${item.id}&type=${currentTab}`,
    });
  };

  useEffect(() => {
    getPlayRands(1);
  }, [currentTab]);

  const getPlayRands = async (currentPage?) => {
    const res = await homeApi.getPlayRands({
      type: "无双赏",
      cate_tag: currentTab,
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

  return (
    <ScrollView
      id="scrollWrap"
      className="matchless-wrap"
      refresherDefaultStyle={"white"}
      refresherBackground={"rgba(0,0,0,0.2)"}
      scrollY
      scrollWithAnimation
      enableFlex
      refresherEnabled
      refresherTriggered={refresherTriggered}
      onScroll={(top) => {
        onScroll(top);
      }}
      lowerThreshold={50}
      upperThreshold={200}
      onScrollToUpper={() => onRefresh}
      onScrollToLower={() => loadMore()}
    >
      <div className="header-wrap">
        {/*<div className="logo-wrap">*/}
        {/*  <Image*/}
        {/*    className="logo"*/}
        {/*    src={require("../../assets/icon/tab_icon_tycs_1@2x.png")}*/}
        {/*  />*/}
        {/*</div>*/}
        <HomeSwiper></HomeSwiper>
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
                hideBox={true}
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
    </ScrollView>
  );
};
export default App;
