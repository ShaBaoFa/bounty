import React from "react";
import { Swiper, SwiperProps } from "./swiper";
import SwiperItem from "@components/SwiperItem";

export type { SwiperProps } from "./swiper";
type CompoundedComponent = React.ForwardRefExoticComponent<
  Partial<SwiperProps> &
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> &
    React.RefAttributes<any>
> & {
  Item: typeof SwiperItem;
};
const InnerSwiper = Swiper as CompoundedComponent;
InnerSwiper.Item = SwiperItem;
export default InnerSwiper;
