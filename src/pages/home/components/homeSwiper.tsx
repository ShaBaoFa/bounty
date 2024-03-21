import Taro, {
  startAccelerometer,
  stopAccelerometer,
  onAccelerometerChange,
  offDeviceMotionChange,
  useDidShow,
  useDidHide,
} from "@tarojs/taro";
import { useRef, useState, useEffect } from "react";
import { Image } from "@tarojs/components";
import Barrage from "@components/Barrage";
import Swiper from "@components/Swiper";
import homeApi from "@src/apis/home";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";
import classNames from "classnames";

const barrageStyle = {
  padding: "16px 0",
  height: "130px",
  boxSizing: "border-box",
};

const homeSwiper = (props) => {
  const [swiperList, setSwiperList] = useState<any[]>([]);
  const [isShow, setIsShow] = useState(true);
  const [lastRotate, setLastRotate] = useState(0);
  const [rotateDeg, setRotateDeg] = useState({
    x: 0,
  });
  const [barrageList, setBarrageList] = useState([]);
  const barrageRef = useRef(null);

  useDidShow(() => {
    startAccelerometer({
      interval: "normal",
    });
    onAccelerometerChange((result) => {
      requestAnimationFrame(() => {
        if (
          Math.abs(Math.abs(result.x * 100) - Math.abs(lastRotate * 100)) < 3
        ) {
          return;
        }
        setLastRotate(result.x);
        var xVal = result.x * 72;
        setRotateDeg({
          x: xVal,
        });
      });
    });
  });

  useDidHide(() => {
    offDeviceMotionChange();
    stopAccelerometer();
  });

  useEffect(() => {
    getCarousel();
  }, []);

  const getCarousel = async () => {
    const res = await homeApi.getCarousel();
    if (res.code === 200) {
      setSwiperList(res.list);
      setBarrageList(res.scroll_list);
      props.setQrCode(res.customer_img);
    }
  };

  const gotoPages = (item) => {
    if (item.tag === "赏办") {
      raffleStore.setBoxNo(1);
      raffleStore.setBoxId(item.plays_id);
      raffleStore.setBoxType("一番赏");
      Taro.navigateTo({
        url: "/subRaffle/classicsRaffle/index",
      });
    } else if (item.tag === "文章") {
      Taro.navigateTo({
        url: `/pages/article/index?id=${item.id}&img=${item.img}`,
      });
    }
  };
  return (
    <div className="swiper-box" style={{ height: Taro.pxTransform(820) }}>
      <Swiper
        defaultValue={0}
        loop
        indicator
        height={Taro.pxTransform(690)}
        onChange={(e) => {
          const item = swiperList[e.detail.current];
          setIsShow(!!item.show_scroll_list);
        }}
      >
        {swiperList.map((item) => (
          <Swiper.Item>
            <div
              className="swiper-item"
              onClick={() => {
                gotoPages(item);
              }}
            >
              <div className="swiper-bg">
                <Image className="bg" src={item.img} mode="aspectFill" />
              </div>
              <Image
                className="swiper-img"
                style={{ transform: `translate3d(${rotateDeg.x}px, 0 , 0)` }}
                src={item.bg}
              />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
      {barrageList.length && (
        <div className={classNames("barrage-wrap", isShow && "show")}>
          <Barrage
            className="barrage"
            ref={barrageRef}
            list={barrageList}
            style={barrageStyle}
          />
        </div>
      )}
      <div
        className="title-wrap"
        onClick={() => {
          props.onShowQrCode(true);
        }}
      >
        <div className="top">
          <img
            className="title-bg"
            src={"https://api.zeecheese.top/assets/icon/home_banner_bg01@2x.png"}
          />
          <img
            className="title"
            src={require("@src/assets/icon/添加客服@2x.png")}
          />
        </div>
        <div className="bottom">
          <img
            className="title-bg"
            src={"https://api.zeecheese.top/assets/icon/home_banner_bg02@2x.png"}
          />
          <img
            className="title"
            src={
              "https://api.zeecheese.top/assets/icon/新品推荐 优惠不断@2x.png"
            }
          />
        </div>
      </div>
    </div>
  );
};
export default homeSwiper;
