import Taro from "@tarojs/taro";
import React, { FunctionComponent } from "react";
import classNames from "classnames";

import { BasicComponent, ComponentDefaults } from "@src/types";

let res = Taro.getSystemInfoSync(); //系统信息
let statusBarHeight = res.statusBarHeight || 44;
let custom = Taro.getMenuButtonBoundingClientRect(); //胶囊按钮位置信息
let navBarHeight =
  (custom.top - statusBarHeight) * 2 + custom.height + statusBarHeight;

export interface NavBarProps extends BasicComponent {
  left: React.ReactNode;
  back: React.ReactNode;
  right: React.ReactNode;
  fixed: boolean;
  needFixed: boolean;
  center: boolean;
  safeAreaInsetTop: boolean;
  placeholder: boolean;
  zIndex: number | string;
  onBackClick: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const defaultProps = {
  ...ComponentDefaults,
  left: "",
  right: "",
  back: "",
  fixed: true,
  needFixed: false,
  safeAreaInsetTop: false,
  placeholder: false,
  center: false,
  zIndex: 10,
  onBackClick: () => {
    const instances = Taro.getCurrentPages();
    if (instances.length > 1) {
      Taro.navigateBack();
    } else {
      Taro.switchTab({
        url: "/pages/home/index",
      });
    }
  },
} as NavBarProps;
export const NavBar: FunctionComponent<Partial<NavBarProps>> = (props) => {
  const {
    right,
    left,
    className,
    style,
    back,
    fixed,
    needFixed,
    safeAreaInsetTop,
    placeholder,
    center,
    zIndex,
    onBackClick,
  } = {
    ...defaultProps,
    ...props,
  };

  const classPrefix = "nut-navbar";

  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  const styles = () => {
    return {
      ...style,
      zIndex,
      height: `${navBarHeight}px`,
    };
  };

  const renderLeft = () => {
    return (
      <div className={`${classPrefix}__left`}>
        {back && (
          <div
            className={`${classPrefix}__left__back`}
            onClick={(e) => onBackClick(e)}
          >
            {back}
          </div>
        )}
        {left}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={classNames(`${classPrefix}__title`, center && "center")}>
        {children}
      </div>
    );
  };

  const renderRight = () => {
    return <div className={`${classPrefix}__right`}>{right}</div>;
  };

  const renderWrapper = () => {
    return (
      <div className={cls} style={styles()}>
        {renderLeft()}
        {renderContent()}
        {renderRight()}
      </div>
    );
  };

  const classes = classNames({
    [`${classPrefix}--fixed`]: fixed,
    [`${classPrefix}--safe-area-inset-top`]: safeAreaInsetTop,
  });

  const cls = classNames(classPrefix, classes, className);

  return (
    <>
      {!fixed ? (
        <div
          style={{
            height: navBarHeight + "px",
          }}
        >
          {renderWrapper()}
        </div>
      ) : needFixed ? (
        <div
          style={{
            height: navBarHeight + "px",
          }}
        >
          {renderWrapper()}
        </div>
      ) : (
        renderWrapper()
      )}
    </>
  );
};

NavBar.defaultProps = defaultProps;
NavBar.displayName = "NutNavBar";
