import { View, Image } from "@tarojs/components";

const classPrefix = `nut-cart-goods-card`;
const CartGoodsCard = (props) => {
  const { info, onClick } = props;
  return (
    <View className={classPrefix} onClick={() => onClick()}>
      {info.ye_num <= 0 && (
        <View className="overlay">
          <Image
            className="overlay-icon"
            src={require("../../../assets/icon/售罄@2x (1).png")}
            mode="heightFix"
          ></Image>
        </View>
      )}
      {info.tag && (
        <View className="goods-status">
          <Image className="status-img" src={info.tag} mode="heightFix" />
        </View>
      )}
      <View className="goods-img-wrap">
        <Image className="img" src={info.image} mode="aspectFill" />
        <View className="number">
          {info.grade} {info.ye_num}/{info.total}
        </View>
      </View>
      <View className="goods-title">{info.name}</View>
      <View className="goods-title chance">中奖率：{info.rate_desc}</View>
      <View className="goods-title reference-price">
        官方参考价：{info.market}元
      </View>
    </View>
  );
};

export default CartGoodsCard;
