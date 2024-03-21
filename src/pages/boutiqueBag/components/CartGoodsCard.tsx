import { Image } from "@tarojs/components";
import CheckBox from "@src/components/Checkbox";

import classNames from "classnames";

const classPrefix = `nut-cart-goods-card`;
const CartGoodsCard = (props) => {
  const { info, checked, onClick } = props;
  return (
    <div className={classNames(classPrefix)}>
      <div className="goods-check">
        <CheckBox
          borderColor="#B23C37"
          checked={checked}
          onClick={(checked) => onClick(checked)}
        ></CheckBox>
      </div>
      <div className="goods-img-wrap">
        <Image
          className="img"
          src={"https://api.zeecheese.top/storage/" + info.kit.image}
          mode="scaleToFill"
        />
        <div className="number">✖ {info.num}</div>
      </div>
      <div className="goods-title">{info.kit.name}</div>
    </div>
  );
};

export default CartGoodsCard;
