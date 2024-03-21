import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  ReactPortal,
  ReactNode,
} from "react";
import Taro from "@tarojs/taro";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import Swiper from "../Swiper";
import { EnterHandler, ExitHandler } from "react-transition-group/Transition";
import { View, Image, ITouchEvent } from "@tarojs/components";

import {
  OverlayProps,
  defaultOverlayProps,
} from "@src/components/overlay/overlay";
import Overlay from "@src/components/overlay/index";
import { ComponentDefaults } from "@src/types";

type Teleport = HTMLElement | (() => HTMLElement) | null;

export interface DetailPopupProps extends OverlayProps {
  swiperList: any[];
  defaultValue: number;
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
  onOverlayClick: (e: ITouchEvent) => boolean | void;
  onCloseIconClick: (e: ITouchEvent) => boolean | void;
}

const defaultProps = {
  ...ComponentDefaults,
  defaultValue: 0,
  position: "center",
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
  onOverlayClick: (e: ITouchEvent) => true,
  onCloseIconClick: (e: ITouchEvent) => true,
  ...defaultOverlayProps,
} as DetailPopupProps;

let _zIndex = 2000;

export const DetailPopup: FunctionComponent<
  Partial<DetailPopupProps> &
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
    defaultValue,
    swiperList,
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
  } = { ...defaultProps, ...props };

  const [index, setIndex] = useState(zIndex || _zIndex);
  const [innerVisible, setInnerVisible] = useState(visible);
  const [showChildren, setShowChildren] = useState(true);
  const [transitionName, setTransitionName] = useState("");

  const classPrefix = "nut-detailPopup";
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

  const renderPop = () => {
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
          <Swiper
            defaultValue={defaultValue}
            loop
            indicator={false}
            height={Taro.pxTransform(900)}
          >
            {swiperList.map((item) => (
              <Swiper.Item>
                <div className="swiper-item">
                  <div className="swiper-bg">
                    <Image className="bg" src={item.image} mode="scaleToFill" />
                  </div>
                  <div className="info">
                    <div className="name">{item.name}</div>
                    <div className="level">赏级：{item.grade}</div>
                    <div className="price">官方参考价：{item.market}元</div>
                  </div>
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
          <div className="tips">滑动查看更多</div>
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

DetailPopup.defaultProps = defaultProps;
DetailPopup.displayName = "NutDetailPopup";
