import React, { ForwardRefRenderFunction } from "react";
import { Image } from "@tarojs/components";

import classNames from "classnames";
import { BasicComponent, ComponentDefaults } from "@src/types";

import "./index.scss";

export interface GoodsCardProps extends BasicComponent {
  info: any;
  symbol: string;
  hideBox: boolean;
  unit: "";
  onClick: () => void;
}

const defaultProps = {
  ...ComponentDefaults,
  list: [],
};

const classPrefix = `nut-goods-card`;
const InternalGoodsCard: ForwardRefRenderFunction<
  unknown,
  Partial<GoodsCardProps>
> = (props, ref) => {
  const {
    className,
    info = {},
    hideBox = false,
    onClick,
  } = {
    ...defaultProps,
    ...props,
  };

  return (
    <div
      className={classNames(classPrefix, className)}
      onClick={() => onClick && onClick()}
    >
      {info.tags_img && (
        <div className="goods-status">
          <Image className="status-img" src={info.tags_img} mode="heightFix" />
        </div>
      )}
      <div className="goods-img-wrap">
        <Image className="img" src={info.img} mode="aspectFill" />
      </div>
      <div className="goods-title">{info.name}</div>
      <div className="goods-content">
        <p className="price">
          <span className="preferential">¥{info.price}</span>
          {info.originalPrice && (
            <span className="original">¥{info.originalPrice}</span>
          )}
        </p>
        {!hideBox && (
          <p className="number">
            <span className="extant">{info.remaining_box_num}</span>
            <span className="symbol">/</span>
            <span className="total">{info.box_num}</span>
            <span className="unit">箱</span>
          </p>
        )}
      </div>
    </div>
  );
};

export const GoodsCard = React.forwardRef<unknown, Partial<GoodsCardProps>>(
  InternalGoodsCard
);

GoodsCard.defaultProps = defaultProps;
GoodsCard.displayName = "NutGoodsCard";
