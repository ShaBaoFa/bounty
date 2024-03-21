import React, { useState } from "react";
import { Image } from "@tarojs/components";
import classNames from "classnames";

const guide1 = require("./../../assets/icon/1.png");
const guide2 = require("./../../assets/icon/2.png");
const guide3 = require("./../../assets/icon/3.png");
const guide5 = require("./../../assets/icon/5.png");
const guide6 = require("./../../assets/icon/6.png");
const guide7 = require("./../../assets/icon/7.png");
const guide8 = require("./../../assets/icon/8.png");
const guide9 = require("./../../assets/icon/9.png");

function NoviceGuide() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="guide-wrap">
      <div className={classNames("image-wrap", current === 1 && "active")}>
        <Image src={guide1} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 2 && "active")}>
        <Image src={guide2} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 3 && "active")}>
        <Image src={guide3} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 5 && "active")}>
        <Image src={guide5} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 6 && "active")}>
        <Image src={guide6} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 7 && "active")}>
        <Image src={guide7} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 8 && "active")}>
        <Image src={guide8} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
      <div className={classNames("image-wrap", current === 9 && "active")}>
        <Image src={guide9} mode="top"></Image>
        <div className="btn" onClick={() => setCurrent(2)}></div>
      </div>
    </div>
  );
}

export default NoviceGuide;
