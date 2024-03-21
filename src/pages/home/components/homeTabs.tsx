import React, { useState, useEffect } from "react";
import { Image } from "@tarojs/components";
import classNames from "classnames";

import "./index.scss";

function HomeTabs(props) {
  const { onClick } = props;
  const [current, setCurrent] = useState(0);
  const [tabs, setTabs] = useState([
    {
      name: "一番赏",
      icon: require("../../../assets/icon/tab_icon_yfs_2@x.png"),
      activeIcon: require("../../../assets/icon/tab_icon_yfs_selected@2x.png"),
    },
    {
      name: "拆卡机",
      icon: require("../../../assets/icon/tab_icon_ckj_default@2x.png"),
      activeIcon: require("../../../assets/icon/tab_icon_ckj_1@2x.png"),
    },
    {
      name: "擂台赏",
      icon: require("../../../assets/icon/tab_icon_lts_default@2x.png"),
      activeIcon: require("../../../assets/icon/tab_icon_lts_1@2x.png"),
    },
    {
      name: "扭蛋机",
      icon: require("../../../assets/icon/tab_icon_ndj_default@2x.png"),
      activeIcon: require("../../../assets/icon/tab_icon_ndj_1@2x.png"),
    },
  ]);

  return (
    <div className="tabs-wrap">
      {props.children}
      <div className="tabs-container">
        {tabs.map((item, index) => (
          <div
            className="tab-item"
            key={item.name}
            onClick={() => {
              setCurrent(index);
              onClick(item.name);
            }}
          >
            <Image
              className={classNames("tab-icon", current === index && "active")}
              src={current === index ? item.activeIcon : item.icon}
              mode="heightFix"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeTabs;
