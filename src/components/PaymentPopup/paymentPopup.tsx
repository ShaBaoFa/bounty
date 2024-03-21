import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  ReactPortal,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import { RectRight } from "@nutui/icons-react-taro";
import { Image } from "@tarojs/components";
import { EnterHandler, ExitHandler } from "react-transition-group/Transition";
import { View, ITouchEvent } from "@tarojs/components";
import Popup from "../popup";
import Button from "../Button";
import CheckBox from "../Checkbox";

import {
  OverlayProps,
  defaultOverlayProps,
} from "@src/components/overlay/overlay";
import Overlay from "@src/components/overlay/index";
import { ComponentDefaults } from "@src/types";
import Taro from "@tarojs/taro";

type Teleport = HTMLElement | (() => HTMLElement) | null;

export interface PaymentPopupProps extends OverlayProps {
  raffleName: string;
  raffleType: string;
  balanceInfo: any;
  couponList: any[];
  couponInfo: any;
  raffleNumber: number;
  position: string;
  transition: string;
  overlayStyle: React.CSSProperties;
  overlayClassName: string;
  closeable: boolean;
  closeIconPosition: string;
  closeIcon: ReactNode;
  left?: ReactNode;
  title?: ReactNode;
  destroyOnClose: boolean;
  portal: Teleport;
  overlay: boolean;
  round: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPopupClick: () => void;
  onChooseZhenQi: () => void;

  onConfirmPayment: (is?, amount?, jump?) => void;
  onOverlayClick: (e: ITouchEvent) => boolean | void;
  onCloseIconClick: (e: ITouchEvent) => boolean | void;
}

const defaultProps = {
  ...ComponentDefaults,
  position: "bottom",
  transition: "",
  overlayStyle: {},
  overlayClassName: "",
  closeable: false,
  closeIconPosition: "top-right",
  closeIcon: "close",
  destroyOnClose: false,
  portal: null,
  overlay: true,
  round: true,
  onOpen: () => {},
  onClose: () => {},
  onPopupClick: () => {},
  onConfirmPayment: () => {},
  onChooseZhenQi: () => {},
  onOverlayClick: (e: ITouchEvent) => true,
  onCloseIconClick: (e: ITouchEvent) => true,
  ...defaultOverlayProps,
} as PaymentPopupProps;

let _zIndex = 2000;

export const PaymentPopup: FunctionComponent<
  Partial<PaymentPopupProps> &
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick" | "title">
> = (props) => {
  const {
    children,
    visible,
    overlay,
    closeOnOverlayClick,
    overlayStyle,
    overlayClassName,
    zIndex,
    lockScroll,
    duration,
    closeable,
    closeIconPosition,
    closeIcon,
    left,
    title,
    raffleName,
    raffleType,
    balanceInfo,
    couponList,
    couponInfo,
    raffleNumber,
    style,
    transition,
    round,
    position,
    className,
    destroyOnClose,
    portal,
    onOpen,
    onClose,
    onOverlayClick,
    onCloseIconClick,
    afterShow,
    afterClose,
    onClick,
    onPopupClick,
    onChooseZhenQi,
    onConfirmPayment,
  } = { ...defaultProps, ...props };

  const [index, setIndex] = useState(zIndex || _zIndex);
  const [innerVisible, setInnerVisible] = useState(visible);
  const [byBalance, setByBalance] = useState(true);
  const [byZhenQi, setByZhenQi] = useState(false);
  const [isAgree, setIsAgree] = useState(true);
  const [isJumpAni, setIsJumpAni] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const [transitionName, setTransitionName] = useState("");

  const classPrefix = "nut-paymentPopup";
  const baseStyle = {
    zIndex: index,
  };

  const overlayStyles = {
    ...overlayStyle,
    ...baseStyle,
  };

  const popStyles = {
    ...style,
    ...baseStyle,
  };

  const popClassName = classNames({
    round,
    [`${classPrefix}`]: true,
    [`${classPrefix}-${position}`]: true,
    [`${className || ""}`]: true,
  });

  const open = () => {
    if (!innerVisible) {
      setInnerVisible(true);
      setIndex(++_zIndex);
    }
    if (destroyOnClose) {
      setShowChildren(true);
    }
    onOpen && onOpen();
  };

  const close = () => {
    if (innerVisible) {
      setInnerVisible(false);
      if (destroyOnClose) {
        setTimeout(() => {
          setShowChildren(false);
        }, Number(duration));
      }
      onClose && onClose();
    }
  };

  const onHandleClickOverlay = (e: ITouchEvent) => {
    e.stopPropagation();
    if (closeOnOverlayClick) {
      const closed = onOverlayClick && onOverlayClick(e);
      closed && close();
    }
  };

  const onHandleClick = (e: ITouchEvent) => {
    onClick && onClick(e);
  };

  const onHandleOpened: EnterHandler<HTMLElement | undefined> | undefined = (
    e: HTMLElement
  ) => {
    afterShow && afterShow();
  };

  const onHandleClosed: ExitHandler<HTMLElement | undefined> | undefined = (
    e: HTMLElement
  ) => {
    afterClose && afterClose();
  };

  const resolveContainer = (getContainer: Teleport | undefined) => {
    const container =
      typeof getContainer === "function" ? getContainer() : getContainer;
    return container || document.body;
  };

  const renderToContainer = (getContainer: Teleport, node: ReactElement) => {
    if (getContainer) {
      const container = resolveContainer(getContainer);
      return createPortal(node, container) as ReactPortal;
    }
    return node;
  };

  const gotoRecharge = () => {
    Taro.navigateTo({
      url: "/subMine/recharge/index",
    });
  };

  const renderPop = () => {
    const totalPrice = balanceInfo.price * raffleNumber;
    const paymentPrice =
      balanceInfo.price * raffleNumber - (couponInfo.value || 0);

    return (
      <CSSTransition
        classNames={transitionName}
        unmountOnExit
        timeout={duration}
        in={innerVisible}
        onEntered={onHandleOpened}
        onExited={onHandleClosed}
      >
        <View
          style={popStyles}
          className={popClassName}
          onClick={onHandleClick}
        >
          <div className="title-wrap">{raffleName}</div>
          <div className="price">
            <div className="unit-price">单抽：{balanceInfo.price}元</div>
            <div className="total-price">
              买{raffleNumber}张 共计
              <span className="result">{totalPrice}元</span>
            </div>
          </div>
          <div className="coupon">
            <div className="name">
              <Image
                className="icon"
                src={require("../../assets/icon/icon2@2x.png")}
              ></Image>
              优惠券
            </div>
            <div
              className="select"
              onClick={() => {
                if (couponList.length > 0) {
                  setByZhenQi(false);
                  onPopupClick();
                }
              }}
            >
              {couponInfo.id ? (
                <span className="red">-{couponInfo.value}元</span>
              ) : (
                <span>
                  {couponList.length
                    ? couponList.length + "张可用"
                    : "暂无可用"}
                </span>
              )}

              <RectRight color="#979797"></RectRight>
            </div>
          </div>
          <div className="payment-wrap">
            <div className="title">请选择支付方式</div>
            <div className="total">
              支付合计：
              <span className="result">
                {byZhenQi
                  ? paymentPrice - balanceInfo.point > 0
                    ? paymentPrice - balanceInfo.point
                    : 0
                  : paymentPrice}
                元
              </span>
            </div>
          </div>
          <div className="payment-type">
            <div className="balance">
              <div className="name">
                <Image
                  className="icon"
                  src={require("../../assets/icon/icon_home_wybj@2x.png")}
                ></Image>
                余额 {balanceInfo.taid}元
              </div>
              <div className="checkbox-wrap">
                {balanceInfo.taid >= paymentPrice ? (
                  byBalance &&
                  (!byZhenQi ? (
                    <span className="text">-（{paymentPrice}元）</span>
                  ) : (
                    <span className="text">
                      {paymentPrice - balanceInfo.point > 0
                        ? `-（${paymentPrice - balanceInfo.point}元）`
                        : null}
                    </span>
                  ))
                ) : (
                  <span className="red" onClick={() => gotoRecharge()}>
                    余额不足，去充值
                  </span>
                )}

                {balanceInfo.taid >= paymentPrice ? (
                  <CheckBox
                    borderColor="#DC3A26"
                    checked={byBalance}
                    onClick={() => {}}
                  ></CheckBox>
                ) : (
                  <RectRight
                    color="#979797"
                    onClick={() => gotoRecharge()}
                  ></RectRight>
                )}
              </div>
            </div>
            <div className="zhenQi">
              <div className="name">
                <Image
                  className="icon"
                  src={require("../../assets/icon/Group 123@2x.png")}
                ></Image>
                真气 {balanceInfo.point}
              </div>
              <div className="checkbox-wrap">
                {(balanceInfo.point >= paymentPrice ||
                  balanceInfo.point + balanceInfo.taid >= paymentPrice) &&
                  (byZhenQi ? (
                    <span className="text">
                      -（
                      {balanceInfo.point >= paymentPrice
                        ? paymentPrice
                        : balanceInfo.point}
                      元）
                    </span>
                  ) : (
                    <span className="text">使用真气值折扣</span>
                  ))}
                <CheckBox
                  borderColor="#DC3A26"
                  checked={byZhenQi}
                  onClick={(checked) => {
                    setByZhenQi(!checked);
                    if (!checked) {
                      onChooseZhenQi();
                    }
                  }}
                ></CheckBox>
              </div>
            </div>
          </div>
          <div className="confirm">
            <Button
              className="btn"
              shape="square"
              size="large"
              bgColor="#B94641"
              isWhite={false}
              style={{ color: "#ffffff" }}
              onClick={() => {
                if (isAgree) {
                  onConfirmPayment(
                    byZhenQi,
                    balanceInfo.point >= paymentPrice
                      ? paymentPrice
                      : balanceInfo.point,
                    isJumpAni
                  );
                } else {
                  Taro.showToast({
                    icon: "error",
                    title: "请先同意协议",
                  });
                }
              }}
            >
              确认支付
            </Button>
          </div>
          <div className="agreement">
            <div className="checkbox-wrap">
              <CheckBox
                borderColor="#DC3A26"
                checked={isAgree}
                onClick={(checked) => setIsAgree(!checked)}
              >
                <div className="content">我已满18岁，已阅读并同意</div>
                <div
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    Taro.navigateTo({
                      url: "/pages/webview/index?id=6",
                    });
                  }}
                >
                  《用户购买协议》
                </div>
              </CheckBox>
            </div>
            {raffleType === "擂台赏" ? null : (
              <div className="checkbox-wrap">
                <CheckBox
                  borderColor="#DC3A26"
                  checked={isJumpAni}
                  onClick={(checked) => setIsJumpAni(!checked)}
                >
                  <div className="content">跳过开赏动画，直接看结果</div>
                </CheckBox>
              </div>
            )}
          </div>
          <div className="explain">
            <p>
              微信支付购买时，如遇到赏品数量不足的情况，相应的金额会自动退款，退款时间可能有几秒延迟，请耐心等待。支付时如网络状态不佳(如:未出现得赏页面)可退出查看开箱记录，请勿多次支付以免造成损失，如需帮助请联系客服。本平台禁止18周岁以下未成年消费，请悉知!
            </p>
            <p>理性消费，切勿沉迷，让热爱延续!</p>
          </div>
        </View>
      </CSSTransition>
    );
  };

  const renderNode = () => {
    return (
      <>
        {overlay ? (
          <>
            <Overlay
              style={overlayStyles}
              className={overlayClassName}
              visible={innerVisible}
              closeOnOverlayClick={closeOnOverlayClick}
              zIndex={zIndex}
              lockScroll={lockScroll}
              duration={duration}
              onClick={onHandleClickOverlay}
            />
            {renderPop()}
          </>
        ) : (
          <>{renderPop()}</>
        )}
      </>
    );
  };

  useEffect(() => {
    visible && open();
    !visible && close();
  }, [visible]);

  useEffect(() => {
    setTransitionName(transition || `${classPrefix}-slide-${position}`);
  }, [position, transition]);

  return <>{renderToContainer(portal as Teleport, renderNode())}</>;
};

PaymentPopup.defaultProps = defaultProps;
PaymentPopup.displayName = "NutPaymentPopup";
