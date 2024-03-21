import Taro from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Swiper from "@components/Swiper";
import homeApi from "@src/apis/home";

import "./index.scss";

const homeSwiper = () => {
  const [swiperList, setSwiperList] = useState<any[]>([]);

  useEffect(() => {
    getwsbg();
  }, []);

  const getwsbg = async () => {
    const res = await homeApi.getwsbg();
    if (res.code === 200) {
      setSwiperList(res.user_lotter_record);
    }
  };
  return (
    <div className="swiper-box" style={{ height: Taro.pxTransform(820) }}>
      <Swiper defaultValue={0} loop indicator height={Taro.pxTransform(820)}>
        {swiperList.map((item) => (
          <Swiper.Item>
            <div className="swiper-item">
              <div className="header-bg-overlay"></div>
              <Image
                className="bg-img"
                src={item.grade.img}
                mode="scaleToFill"
              />

              <div className="lottery-info-wrap">
                <div className="lottery-name">
                  <Image
                    className="logo"
                    src={"https://api.zeecheese.top/assets/icon/Group 87@2x.png"}
                  ></Image>
                  <div className="name">{item.name}</div>
                </div>
                <div className="lottery-img">
                  <Image
                    className="img-border"
                    src={
                      "https://api.zeecheese.top/assets/icon/Group 130@2x.png"
                    }
                  ></Image>
                  <Image className="img" src={item.grade.img}></Image>
                </div>
                <div className="lottery-prize">
                  <Image
                    className="prize-bg"
                    src={"https://api.zeecheese.top/assets/icon/Group 38@2x.png"}
                  ></Image>
                  <div className="prize">{item.grade.name}</div>
                </div>
              </div>
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
      <div className="join-us-bg">
        <Image
          className="img"
          src={"https://api.zeecheese.top/assets/icon/Group 131@2x.png"}
        />
      </div>
      <div className="join-us">
        <Image
          className="join-us-btn"
          src={"https://api.zeecheese.top/assets/icon/Group 48@2x.png"}
        />
      </div>
    </div>
  );
};
export default homeSwiper;
