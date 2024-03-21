import { Image } from "@tarojs/components";

import classNames from "classnames";

const classPrefix = `nut-cart-goods-card`;
const CartGoodsCard = (props) => {
  const { info, boxInfo, show = true, isModal = false, onClick } = props;
  return (
    <div
      className={classNames(classPrefix, isModal && "small")}
      onClick={() => onClick()}
    >
      {info.total - info.ex_num <= 0 && (
        <div className="overlay">
          <Image
            className="overlay-icon"
            src={require("../../../assets/icon/售罄@2x (1).png")}
            mode="heightFix"
          ></Image>
        </div>
      )}
      {info.tag && (
        <div className="goods-status">
          <Image className="status-img" src={info.tag} mode="aspectFill" />
        </div>
      )}
      <div className="goods-img-wrap">
        <Image className="img" src={info.image} mode="aspectFill" />
        {info.grade === "SAFETY赏" || info.grade === "EMPTY赏" ? (
          <>
            <Image
              className="goods-light"
              src={"https://api.zeecheese.top/assets/icon/光@2x (1).png"}
              mode="aspectFill"
            />
            <div className="continuous">
              <Image
                className="bg"
                src={"https://api.zeecheese.top/assets/icon/button@2x%20(2).png"}
                mode="aspectFill"
              />
              <span className="count">
                {info.combo_num - boxInfo.empty_num}
              </span>
            </div>
          </>
        ) : (
          <div className="number">
            {info.grade} {info.total - info.ex_num}/{info.total}
          </div>
        )}
      </div>
      <div className="goods-title">{info.name}</div>
      {show && (
        <div className="goods-title chance">中奖率：{info.rate_desc}</div>
      )}
      <div className="goods-title reference-price">
        {show ? `官方参考价：${info.market}元` : "B赏 ✖ 12"}
      </div>
    </div>
  );
};

export default CartGoodsCard;
