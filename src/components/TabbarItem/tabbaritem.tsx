import { CoverView, CoverImage } from "@tarojs/components";
import React, { FunctionComponent, ReactNode } from "react";
import classNames from "classnames";
import { BasicComponent, ComponentDefaults } from "@src/types";
// import Badge from "../badge";

export interface TabbarItemProps extends BasicComponent {
  title: ReactNode;
  icon: ReactNode;
  activeIcon: ReactNode;
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  index: number;
  value: ReactNode;
  dot: boolean;
  max: number;
  top: string;
  right: string;
  handleClick: (idx: number) => void;
}

const defaultProps = {
  ...ComponentDefaults,
  title: "",
  icon: null,
  activeIcon: null,
  active: false,
  index: 0,
  value: "",
  dot: false,
  max: 99,
  top: "0",
  right: "5",
} as TabbarItemProps;

export const TabbarItem: FunctionComponent<Partial<TabbarItemProps>> = (
  props
) => {
  const {
    className,
    style,
    title,
    icon,
    activeIcon,
    active,
    activeColor,
    inactiveColor,
    index,
    value,
    dot,
    max,
    top,
    right,
    handleClick,
  } = {
    ...defaultProps,
    ...props,
  };
  const classPrefix = "nut-tabbar-item";
  const tabbarItemClass = classNames(className, classPrefix, {
    [`${classPrefix}-active`]: active,
  });
  const boxPrefix = `${classPrefix}__icon-box`;
  const titleClass = classNames(boxPrefix, `${boxPrefix}-nav`, {
    [`${boxPrefix}-large`]: !icon,
  });

  const badgeProps = {
    value,
    dot,
    max,
    top,
    right,
    color: activeColor,
  };

  return (
    <CoverView
      className={tabbarItemClass}
      style={{
        color: active ? activeColor : inactiveColor,
        ...style,
      }}
      onClick={() => handleClick(index)}
    >
      {icon ? (
        <>
          <CoverView className={boxPrefix}>{active ? activeIcon : icon}</CoverView>
          {title && <CoverView className={titleClass}>{title}</CoverView>}
        </>
      ) : (
        <CoverView className={titleClass}>{title}</CoverView>
      )}
    </CoverView>
  );
};
