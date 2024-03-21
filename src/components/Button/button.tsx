import React, { CSSProperties, useCallback } from "react";
import type { MouseEvent } from "react";
import classNames from "classnames";
import {
  ButtonProps as MiniProgramButtonProps,
  Image,
} from "@tarojs/components";
import { Loading } from "@nutui/icons-react-taro";
import { getEnv } from "@tarojs/taro";
import { BasicComponent, ComponentDefaults } from "@src/types";

type OmitMiniProgramButtonProps = Omit<
  MiniProgramButtonProps,
  "size" | "type" | "onClick" | "style"
>;

export type ButtonType =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";
export type ButtonSize = "large" | "normal" | "small";
export type ButtonShape = "square" | "round";
export type ButtonFill = "solid" | "outline" | "none";

export interface ButtonProps
  extends BasicComponent,
    OmitMiniProgramButtonProps {
  color: string;
  bgColor: string;
  shape: ButtonShape;
  type: ButtonType;
  size: ButtonSize;
  fill: ButtonFill;
  block: boolean;
  loading: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  show: boolean;
  isWhite: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const prefixCls = "nut-button";

const defaultProps = {
  ...ComponentDefaults,
  color: "",
  type: "default",
  size: "normal",
  shape: "round",
  fill: "solid",
  loading: false,
  disabled: false,
  block: false,
  icon: null,
  show: true,
  isWhite: true,
  onClick: (e: MouseEvent<HTMLButtonElement>) => {},
} as ButtonProps;
export const Button = React.forwardRef<HTMLButtonElement, Partial<ButtonProps>>(
  (props, ref) => {
    const {
      color,
      bgColor,
      shape,
      fill,
      loading,
      disabled,
      type,
      size,
      block,
      icon,
      children,
      onClick,
      className,
      style,
      show,
      isWhite,
      ...rest
    } = {
      ...defaultProps,
      ...props,
    };
    const getStyle = useCallback(() => {
      const style: CSSProperties = {};
      if (props.color) {
        if (fill && fill === "outline") {
          style.color = color;
          style.background = "#fff";
          if (!color?.includes("gradient")) {
            style.borderColor = color;
          }
        } else {
          style.color = "#fff";
          style.background = color;
        }
      }
      return style;
    }, [color]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (!loading && !disabled && onClick) {
        onClick(e);
      }
    };
    if (getEnv() === "WEB") {
      (rest as any).type = rest.formType;
    }
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line react/button-has-type
      <button
        {...rest}
        ref={ref}
        className={classNames(
          prefixCls,
          className,
          props.type ? `${prefixCls}--${type}` : null,
          props.fill ? `${prefixCls}--${fill}` : null,
          {
            [`${prefixCls}--${size}`]: size,
            [`${prefixCls}--${shape}`]: shape,
            [`${prefixCls}--block`]: block,
            [`${prefixCls}--disabled`]: disabled,
            [`${prefixCls}--loading`]: loading,
          }
        )}
        style={{ ...getStyle(), ...style }}
        onClick={(e) => handleClick(e)}
      >
        <div className="nut-button__warp">
          {show &&
            (isWhite ? (
              <Image
                className="bg"
                src={require("../../assets/icon/button@2x.png")}
              />
            ) : (
              <Image
                className="bg"
                src={require("../../assets/icon/Group 202@2x.png")}
              />
            ))}
          {loading && <Loading className="nut-icon-loading" />}
          {!loading && icon ? icon : null}
          {children && (
            <div
              className={
                size === "normal" ? "nut-button-text" : "nut-button-text-large"
              }
              style={{ backgroundColor: bgColor || "#0B0B0B" }}
            >
              {children}
            </div>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = "NutButton";
