import { CoverView } from "@tarojs/components";
import React, { FunctionComponent } from "react";
import classNames from "classnames";
import { BasicComponent, ComponentDefaults } from "@src/types";
import { usePropsValue } from "@utils/use-props-value";
import TabbarItem from "../TabbarItem/index";

import "./index.scss";

export interface TabbarProps extends BasicComponent {
  defaultValue: number;
  value?: number;
  fixed: boolean;
  inactiveColor: string;
  activeColor: string;
  safeArea: boolean;
  onSwitch: (value: number) => void;
}

const defaultProps = {
  ...ComponentDefaults,
  defaultValue: 0,
  fixed: false,
  inactiveColor: "",
  activeColor: "",
  safeArea: false,
  onSwitch: (value) => {},
} as TabbarProps;

export const Tabbar: FunctionComponent<Partial<TabbarProps>> & {
  Item: typeof TabbarItem;
} = (props) => {
  const {
    children,
    defaultValue,
    value,
    fixed,
    activeColor,
    inactiveColor,
    safeArea,
    className,
    style,
    onSwitch,
  } = {
    ...defaultProps,
    ...props,
  };
  const classPrefix = "nut-tabbar";

  const [selectIndex, setSelectIndex] = usePropsValue<number>({
    value,
    defaultValue,
    finalValue: 0,
    onChange: onSwitch,
  });

  return (
    <CoverView
      className={classNames(classPrefix, className, {
        [`${classPrefix}__fixed`]: fixed,
      })}
      style={style}
    >
      <CoverView className={`${classPrefix}__wrap`}>
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          const childProps = {
            ...child.props,
            active: idx === selectIndex,
            index: idx,
            inactiveColor,
            activeColor,
            handleClick: setSelectIndex,
          };
          return React.cloneElement(child, childProps);
        })}
      </CoverView>
      <CoverView className="safe-wrap"></CoverView>
      {(fixed || safeArea) && (
        <CoverView className={`${classPrefix}__safe-area`} />
      )}
    </CoverView>
  );
};

Tabbar.defaultProps = defaultProps;
Tabbar.displayName = "NutTabbar";
Tabbar.Item = TabbarItem;
