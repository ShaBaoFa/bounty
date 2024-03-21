import { Component } from "react";
import Taro, { Config } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Swiper from "@components/Swiper";
import classnames from "classnames";
import "./index.scss";
export default class SwiperSL extends Component<any, any> {
  static defaultProps = {
    swiperData: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      swiperList: [],
      leftWidth: 260,
      cacheIndex: 0,
      cardCur: 0,
      left: 0,
      screenRate: 1,
      isMove: false,
    };
  }
  componentWillMount() {}

  componentDidMount() {
    Taro.getSystemInfo({
      success: (res) => {
        // 750除以屏幕宽度，得到转换比。因为API用的和得到的大部分的单位都是px，所以还是要转一下
        this.setState({
          screenRate: 750 / res.screenWidth,
        });
      },
    });
  }

  componentWillReceiveProps(nextProps: Readonly<any>): void {
    this.setState({
      swiperList: nextProps.swiperData,
    });
  }

  componentDidShow() {}

  componentDidHide() {}
  swiperClick(index) {
    this.setState(
      {
        cardCur: index,
      },
      () => {}
    );
  }
  tapLeft() {
    // 0 -> 4
    let cardCur = this.state.cardCur;
    this.setState({
      cardCur: cardCur == 0 ? 4 : cardCur - 1,
    });
  }

  tapRight() {
    let cardCur = this.state.cardCur;
    this.setState({
      cardCur: cardCur == 4 ? 0 : cardCur + 1,
    });
  }
  touchstart(e) {
    this.setState({
      left: e.touches[0].pageX,
    });
  }

  touchmove(e) {
    // 频率控制，一次移动完成后，才能进行下一次
    if (this.state.isMove) {
      return;
    }
    let moveLength =
      (e.touches[0].pageX - this.state.left) * this.state.screenRate;
    moveLength = moveLength > 60 ? 60 : moveLength;
    moveLength = moveLength < -60 ? -60 : moveLength;
    let rate = moveLength / 60;
    if (rate == 1) {
      //从右往左滑
      this.setState(
        {
          isMove: true,
        },
        () => {
          this.tapRight();
        }
      );
    } else if (rate == -1) {
      //从左往右滑
      this.setState(
        {
          isMove: true,
        },
        () => {
          this.tapLeft();
        }
      );
    }
  }
  touchend() {
    setTimeout(() => {
      this.setState({
        isMove: false,
      });
    }, 500);
  }

  render() {
    return (
      <View className="swiperSL">
        <Swiper
          defaultValue={0}
          loop
          previousMargin="24px"
          nextMargin="24px"
          height={Taro.pxTransform(420)}
        >
          {this.state.swiperList.map((item) => (
            <Swiper.Item>
              <div className="swiper-item">
                <div className="swiper-bg">
                  <Image className="bg" src={item.image} mode="aspectFill" />
                </div>
                <div className="name">{item.name}</div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </View>
    );
  }
}
