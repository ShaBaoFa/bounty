import { CoverView, CoverImage } from "@tarojs/components";
import { useState } from "react";
import { observer } from "mobx-react";
import Taro from "@tarojs/taro";
import Tabbar from "@components/Tabbar";
import store from "./store";

import "./index.scss";

import imgsrc from "@src/assets/icon/tabbar_icon_cs_default@3x.png";
import img2src from "@src/assets/icon/tabbar_icon_ws_default@3x.png";
import img3src from "@src/assets/icon/tabbar_icon_sd_default@3x.png";
import img4src from "@src/assets/icon/tabbar_icon_wd_default@3x.png";
import activeImgsrc from "@src/assets/icon/tabbar_icon_cs_selected@3x.png";
import active2Imgsrc from "@src/assets/icon/tabbar_icon_ws_selected@3x.png";
import active3Imgsrc from "@src/assets/icon/tabbar_icon_sd_selected@3x.png";
import active4Imgsrc from "@src/assets/icon/tabbar_icon_wd_selected@3x.png";

function CustomTabBar() {
  const [urlMap] = useState([
    {
      name: "抽赏",
      url: "/pages/home/index",
    },
    {
      name: "无双",
      url: "/pages/matchless/index",
    },
    {
      name: "赏袋",
      url: "/pages/boutiqueBag/index",
    },
    {
      name: "我的",
      url: "/pages/mine/index",
    },
  ]);
  const switchTab = (val) => {
    store.setActiveTab(val);
    Taro.switchTab({
      url: urlMap[val].url,
    });
  };

  return (
    <Tabbar
      className="custom-tab-wrap"
      fixed
      safeArea
      defaultValue={store.activeTab}
      value={store.activeTab}
      onSwitch={(val) => {
        switchTab(val);
      }}
    >
      <Tabbar.Item
        icon={<CoverImage className="tabbar-icon" src={imgsrc} />}
        activeIcon={<CoverImage className="tabbar-icon" src={activeImgsrc} />}
      />
      <Tabbar.Item
        icon={<CoverImage className="tabbar-icon" src={img2src} />}
        activeIcon={<CoverImage className="tabbar-icon" src={active2Imgsrc} />}
      />
      <Tabbar.Item
        icon={<CoverImage className="tabbar-icon" src={img3src} />}
        activeIcon={<CoverImage className="tabbar-icon" src={active3Imgsrc} />}
      />
      <Tabbar.Item
        icon={<CoverImage className="tabbar-icon" src={img4src} />}
        activeIcon={<CoverImage className="tabbar-icon" src={active4Imgsrc} />}
      />
    </Tabbar>
  );
}

export default observer(CustomTabBar);
