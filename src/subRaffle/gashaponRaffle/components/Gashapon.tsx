import regeneratorRuntime from "regenerator-runtime";
import React, { Component, useRef } from "react";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { setDomPosition } from "./../box2d/Utils";
import { World, Item } from "./../box2d";

import BallTai from "./../../../assets/icon/球-太@2x.png";
import BallChao from "./../../../assets/icon/球-潮@2x.png";

const toRadians = function (degrees) {
  return (degrees * Math.PI) / 180;
};
const forceAtAngle = (x, angle, gravity = 6) => {
  let y = x * Math.tan(angle);
  return [x - gravity, -50];
};

const systemInfo = Taro.getSystemInfoSync();

interface State {
  boxInfo: any;
  cannonBalls: any[];
  angle: number;
  lightActive: boolean;
  canvasWidth: number;
  canvasHeight: number;
  ballDiameter: number;
  leftDistance: number;
}

interface Props {
  boxInfo: any;
  onPrev: () => void;
  onNext: () => void;
  onShowRecord: () => void;
  onShowExplain: () => void;
  onRefresh: () => void;
  onLockbox: () => void;
  onBackLock: () => void;
  onShowPayment: (number) => void;
}

class Gashapon extends Component<Props> {
  worldRef: any = React.createRef();
  timer: any = null;
  lightTimer: any = null;
  state: State = {
    boxInfo: this.props.boxInfo,
    cannonBalls: [],
    angle: 135,
    lightActive: false,
    canvasWidth: systemInfo.screenWidth * 0.72,
    canvasHeight: systemInfo.screenWidth * 0.46,
    leftDistance: systemInfo.screenWidth * 0.46,
    ballDiameter: systemInfo.screenWidth * 0.09,
  };

  makeCannonBall = () => {
    const { angle } = this.state;
    this.setState({
      angle: angle + 3,
    });
    return { force: forceAtAngle(20, toRadians(angle)) };
  };

  createCannonBall = () => {
    const { cannonBalls } = this.state;
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      if (cannonBalls.length < 10) {
        const cannonBall = this.makeCannonBall();
        cannonBalls.push(cannonBall);
        this.setState(cannonBalls);
        this.createCannonBall();
      } else {
        this.setState({
          angle: 135,
        });
      }
    }, 210);
  };

  handleResetCannonBall = () => {
    const bWorld = this.worldRef.current.world;
    bWorld.ClearForces();
    this.setState(
      {
        cannonBalls: [],
      },
      () => {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.createCannonBall();
      }
    );
  };

  componentDidMount(): void {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.createCannonBall();
    }, 1000);
    this.lightTimer = setInterval(() => {
      const { lightActive } = this.state;
      this.setState({ lightActive: !lightActive });
    }, 500);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    this.setState({
      boxInfo: nextProps.boxInfo,
    });
  }

  setBallPosition = (index) => {
    // let current = 0;
    // const bWorld = this.worldRef.current.world;
    // for (let b = bWorld.m_bodyList; b; b = b.m_next) {
    //   current++;
    //   let userData = b.GetUserData();
    //   if (userData && userData.dom && current === index) {
    //     if (userData.removed) {
    //       bWorld.DestroyBody(b);
    //     } else {
    //       let { x, y } = b.GetPosition();
    //       let angle = b.GetAngle();
    //       if (userData.rc) {
    //         setDomPosition(
    //           userData.dom,
    //           userData.rc.width,
    //           userData.rc.height,
    //           x + 0.25,
    //           y - 0.25,
    //           angle,
    //           60
    //         );
    //       }
    //     }
    //   }
    // }
  };

  render() {
    let {
      boxInfo,
      cannonBalls,
      canvasWidth,
      canvasHeight,
      leftDistance,
      ballDiameter,
      lightActive,
    } = this.state;
    const {
      onPrev,
      onNext,
      onShowRecord,
      onShowExplain,
      onLockbox,
      onBackLock,
      onShowPayment,
    } = this.props;
    return (
      <div className="gashapon-box">
        <div className="overlay-bg">
          <Image
            className="bg"
            src={"https://api.zeecheese.top/assets/icon/扭蛋机@2x.png"}
          ></Image>
        </div>
        <div className="overlay"></div>

        <div className="price">￥{boxInfo.price}元</div>
        <div className="surplus">
          剩余扭蛋：
          {((boxInfo.residue_kit / boxInfo.all_kits) * 100).toFixed(2)}%
        </div>
        <div
          className="refresh-btn"
          onClick={() => this.props.onRefresh()}
        ></div>
        <div className="record-btn" onClick={() => onShowRecord()}></div>
        <div className="explain-btn" onClick={() => onShowExplain()}></div>
        <div className="prev-btn" onClick={() => onPrev()}></div>
        <div className="next-btn" onClick={() => onNext()}></div>
        {boxInfo.lock_num > 0 && (
          <div
            className="lock-btn"
            onClick={() => {
              if (boxInfo.is_lock) {
                onBackLock();
              } else {
                onLockbox();
              }
            }}
          >
            {boxInfo.is_lock ? (
              <Image
                className="img"
                src={require("./../../../assets/icon/Group 219@2x.png")}
              ></Image>
            ) : (
              <Image
                className="img"
                src={require("./../../../assets/icon/Group 218@2x.png")}
              ></Image>
            )}
          </div>
        )}
        <div className="world-wrap">
          <World
            width={canvasWidth}
            height={canvasHeight}
            className="world"
            ref={this.worldRef}
            gravity={[0, 20.8]}
          >
            {cannonBalls.map((x, index) => (
              <Item
                key={"world" + index}
                left={leftDistance - index * 16}
                top={0}
                density={0.9}
                width={ballDiameter}
                height={ballDiameter}
                initialForce={x.force}
                shape="circle"
              >
                <div
                  className="cannon-ball"
                  onClick={() => this.setBallPosition(index)}
                >
                  <Image
                    className="img"
                    src={index % 2 === 0 ? BallChao : BallTai}
                  ></Image>
                </div>
              </Item>
            ))}
          </World>
        </div>
        <div className="raffle-wrap">
          <div className="btn one" onClick={() => onShowPayment(1)}></div>
          <div className="btn three" onClick={() => onShowPayment(3)}></div>
          <div className="btn five" onClick={() => onShowPayment(5)}></div>
          <div className="btn ten" onClick={() => onShowPayment("try")}></div>
        </div>
        <div className={classNames("light-wrap", lightActive && "active")}>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
          <div className="light-item"></div>
        </div>
      </div>
    );
  }
}

export default Gashapon;
