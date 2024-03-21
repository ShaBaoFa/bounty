import { observer } from "mobx-react";
import { Component } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { Image } from "@tarojs/components";
import Button from "@src/components/Button";
import Dialog from "@src/components/Dialog";
import mineApi from "@src/apis/mine";
import raffleStore from "@src/store/raffleStore";

import "./index.scss";

interface Props {}
interface State {
  visible: boolean;
  cardShow: boolean;
  prizeList: any[];
  sourceList: any[];
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  current: number;
  currentPage: number;
  currentItem: any;
  posWidth: number;
  posHeight: number;
  dxAngle: number;
  tracking: boolean;
  animation: boolean;
  opacity: number;
}

@observer
class Stroll extends Component<Props> {
  state: State = {
    visible: false,
    cardShow: false,
    prizeList: [],
    sourceList: raffleStore.resultList,
    startX: "",
    startY: "",
    endX: "",
    endY: "",
    current: 0,
    currentPage: 0,
    currentItem: {},
    posWidth: 0,
    posHeight: 0,
    dxAngle: 0,
    tracking: false,
    animation: false,
    opacity: 1,
  };

  componentWillMount() {
    this.recommendList(5);
  }

  async recommendList(current) {
    const { prizeList } = this.state;
    if (prizeList.length) {
      this.setState({
        current: current,
        cardShow: true,
        prizeList: [
          prizeList[prizeList.length - 1],
          ...raffleStore.resultList.slice(current - 5, current),
        ],
      });
    } else {
      this.setState({
        current: current,
        cardShow: true,
        prizeList: raffleStore.resultList.slice(current - 5, current),
      });
    }
  }

  componentDidHide() {
    this.setState(
      {
        prizeList: [],
      },
      () => {
        this.setState({
          currentPage: 0,
        });
      }
    );
  }

  // 首页样式切换
  transformIndex(index, color) {
    // 处理3D效果
    if (index === this.state.currentPage) {
      let style = {};
      style["transform"] =
        "translate3D(" +
        this.state.posWidth +
        "px" +
        "," +
        this.state.posHeight +
        "px" +
        ",0px)" +
        "rotate(" +
        this.state.dxAngle +
        "deg)";
      style["opacity"] = this.state.opacity;
      // 增加层级
      style["zIndex"] = 10 + index;
      style["box-shadow"] = "0px 1px 20px 0px rgba(0,0,0,0.1)";
      style["background"] = color;
      if (this.state.animation) {
        style["transitionTimingFunction"] = "ease";
        style["transitionDuration"] = 500 + "ms";
      }
      return style;
    }
  }

  // 非首页样式切换
  transform(index, color) {
    if (index > this.state.currentPage) {
      let style = {};
      let visible = 10;
      let perIndex = index - this.state.currentPage;
      if (index <= this.state.currentPage + visible) {
        style["opacity"] = "1";
        style["transform"] =
          "translate3D(0,0," + -1 * perIndex * 0 + "px" + ")";
        style["zIndex"] = visible - index + this.state.currentPage;
        style["transitionTimingFunction"] = "ease";
        style["transitionDuration"] = 500 + "ms";
        style["box-shadow"] = "0px 1px 20px 0px rgba(0,0,0,0.1)";
        style["background"] = color;
      } else {
        style["zIndex"] = "-1";
        style["transform"] =
          "translate3D(0,0," + -1 * visible * 10 + "px" + ")";
        style["background"] = color;
      }
      return style;
    } else {
      let style = {};
      style["opacity"] = "0";
      style["transitionDuration"] = "0ms";
      return style;
    }
  }

  //触摸开始
  touchstart(e) {
    e.preventDefault();
    if (!this.state.tracking) {
      const touch = e.changedTouches[0];
      this.setState({
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        tracking: true,
        animation: false,
      });
    }
  }

  // 触摸移动
  touchmove(e) {
    e.preventDefault();
    if (this.state.tracking && !this.state.animation) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const posWidth = endX - this.state.startX;
      const posHeight = endY - this.state.startY;
      const dxAngle = posWidth / 10;

      this.setState({
        endX,
        endY,
        posWidth,
        posHeight,
        dxAngle,
      });
    }
  }

  touchend(id, type, e) {
    e.preventDefault();
    // console.log("End X:", this.state.endX, "Start X:", this.state.startX);
    // console.log("Position Width:", this.state.posWidth);

    this.setState((prevState) => ({
      ...prevState,
      tracking: false,
      animation: true,
    }));

    if (Math.abs(this.state.posWidth) >= 20) {
      // 调整此阈值
      let ratio = Math.abs(this.state.posHeight / this.state.posWidth);
      this.setState(
        {
          posWidth:
            this.state.posWidth >= 0
              ? this.state.posWidth + 500
              : this.state.posWidth - 500,
          posHeight:
            this.state.posHeight >= 0
              ? Math.abs(this.state.posWidth * ratio)
              : -Math.abs(this.state.posWidth * ratio),
          opacity: 0,
        },
        () => {
          setTimeout(() => {
            this.setState(
              {
                currentPage: this.state.currentPage + 1,
                posWidth: 0,
                posHeight: 0,
                dxAngle: 0,
                opacity: 1,
                animation: false,
              },
              () => {
                if (this.state.currentPage === this.state.current - 1) {
                  this.recommendList(this.state.current + 5);
                }
                if (this.state.currentPage === raffleStore.resultList.length) {
                  this.setState({
                    prizeList: [],
                    currentPage: 0,
                  });
                  Taro.navigateBack();
                }
              }
            );
          }, 400);
        }
      );
    }
  }

  crushPrize() {
    this.setState(
      {
        posWidth: -500,
        posHeight: 100,
        dxAngle: -20,
        opacity: 0,
        animation: true,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              currentPage: this.state.currentPage + 1,
              posWidth: 0,
              posHeight: 0,
              dxAngle: 0,
              opacity: 1,
              animation: false,
            },
            () => {
              if (this.state.currentPage === this.state.current - 1) {
                this.recommendList(this.state.current + 5);
              }
              if (this.state.currentPage === raffleStore.resultList.length) {
                Taro.navigateBack();
              }
            }
          );
        }, 400);
      }
    );
  }
  async submitApplyRefund(item) {
    if (item.isTry) {
      Taro.showToast({
        icon: "none",
        title: "试玩赏品不支持分解",
      });
      return;
    }
    const ids = {
      [item.kit_id]: 1,
    };
    const res = await mineApi.decompose({
      ids: JSON.stringify(ids),
    });
    if (res.code === 200) {
      this.setState({
        visible: false,
      });
      this.crushPrize();
    } else {
      Taro.showToast({
        icon: "error",
        title: res.msg,
      });
    }
  }

  render() {
    const { visible, prizeList, currentItem, currentPage } = this.state;
    return (
      <div className="stroll-tab">
        <div className="stack">
          {prizeList.map((item) => {
            return (
              <div
                key={item.kit_id}
                className={classNames(
                  "stack-item",
                  (currentPage === item.index ||
                    currentPage + 1 === item.index) &&
                    "active"
                )}
                style={
                  this.transformIndex(item.index, item.picMainColor) ||
                  this.transform(item.index, item.picMainColor)
                }
                onTouchStart={this.touchstart.bind(this)}
                onTouchMove={this.touchmove.bind(this)}
                onTouchEnd={this.touchend.bind(
                  this,
                  item.skuId,
                  item.productSourceType
                )}
              >
                <div className="card-bg">
                  <Image
                    className="card-img"
                    src={require("./../../assets/icon/卡片bg@2x.png")}
                    mode="heightFix"
                  ></Image>
                </div>
                <div className="prize-info">
                  <div className="prize-title">恭喜获得奖品</div>
                  <div className="prize-name">{item.kit.name} x1</div>
                  <div className="prize-img">
                    <Image
                      className="img"
                      src={item.kit.image}
                      mode="aspectFill"
                    ></Image>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="prize-operation">
            <div className="btn-wrap">
              <Button
                className="btn"
                shape="square"
                onClick={() => {
                  Taro.switchTab({
                    url: "/pages/boutiqueBag/index",
                  });
                }}
              >
                前往赏袋
              </Button>
              <Button
                className="btn"
                shape="square"
                bgColor="#B94641"
                style={{ color: "#ffffff" }}
                onClick={() => {
                  Taro.navigateBack();
                }}
              >
                继续抽赏
              </Button>
            </div>
            <div className="explain">左右滑动可查看下一张</div>
          </div>
        </div>

        <Dialog
          title="申请退货"
          visible={visible}
          confirmText="确认"
          cancelText="取消"
          onConfirm={() => {
            this.submitApplyRefund(currentItem);
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          退货{1}个手办，将获得{currentItem.kit ? currentItem.kit.point : ""}
          太豆
        </Dialog>
      </div>
    );
  }
}

export default Stroll;
