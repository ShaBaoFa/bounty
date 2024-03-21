import React, {
  ForwardRefRenderFunction,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { createSelectorQuery } from "@tarojs/taro";

import classNames from "classnames";
import { BasicComponent, ComponentDefaults } from "@src/types";

import "./index.scss";

import imgsrc from "./../../assets/icon/tabbar_icon_ws_default@2x.png";

export interface BarrageProps extends BasicComponent {
  list: Array<any>;
  interval: number;
  loop: boolean;
  duration: number;
  rows: number;
  gapY: number;
}

const defaultProps = {
  ...ComponentDefaults,
  list: [],
  interval: 1900,
  loop: true,
  duration: 6400,
  rows: 3,
  gapY: 10,
};

const classPrefix = `nut-barrage`;
const InternalBarrage: ForwardRefRenderFunction<
  unknown,
  Partial<BarrageProps>
> = (props, ref) => {
  const {
    className,
    interval,
    loop,
    list,
    duration,
    rows,
    gapY,
    ...restProps
  } = {
    ...defaultProps,
    ...props,
  };
  const [styleList, setStyleList] = useState<any[]>([]);
  const [baItemList, setBaItemList] = useState(list);
  const barrageListSet = useRef<any>(list);

  const barrageBody = useRef<HTMLDivElement>(null);
  const barrageContainer = useRef<HTMLDivElement>(null);
  const timeId = useRef(new Date().getTime());
  const timer = useRef(0);

  const classes = classNames(className, classPrefix, {
    [`${classPrefix}__body${timeId.current}`]: true,
  });

  useImperativeHandle(ref, () => ({
    add: (word: string) => {
      barrageListSet.current = [...barrageListSet.current, word];
      run();
    },
  }));

  useEffect(() => {
    barrageListSet.current = [...list];
    run();
    return () => {
      clearInterval(timer.current);
    };
  }, [list]);

  const run = () => {
    setBaItemList(barrageListSet.current);
    barrageListSet.current.forEach((item: any, index: number) => {
      getNode(index);
    });
  };

  const getNode = (index: number) => {
    const query = createSelectorQuery();
    setTimeout(() => {
      let width = 100;
      query
        .select(`.${classPrefix}__body${timeId.current}`)
        .boundingClientRect((rec: any) => {
          width = rec.width || 300;
        });

      query
        .select(`.${classPrefix}__item${index}`)
        .boundingClientRect((recs: any) => {
          const height = recs.height;
          const nodeTop = `${(index % rows) * (height + gapY) + 20}px`;
          styleInfo(index, nodeTop, width);
        })
        .exec();
    }, 1000 / 100);
  };

  const styleInfo = (index: number, nodeTop: string, width: number) => {
    const timeIndex = index - rows > 0 ? index - rows : 0;
    const list = styleList;
    const time = list[timeIndex] ? Number(list[timeIndex]["--time"]) : 0;
    const obj = {
      top: nodeTop,
      "--time": `${interval * index + time}`,
      animationDuration: `${duration}ms`,
      animationIterationCount: `${loop ? "infinite" : 1}`,
      animationDelay: `${interval * index + time}ms`,
      "--move-distance": `-${width}px`,
    };
    list.push(obj);
    setStyleList([...list]);
  };

  return (
    <div className={classes} ref={barrageBody} {...restProps}>
      <div ref={barrageContainer} className="bContainer">
        {baItemList.map((item: any, index: number) => {
          return (
            <div
              className={`barrage-item ${classPrefix}__item${index} move`}
              style={styleList[index]}
              key={index}
            >
              <img className={"barrage-avatar"} src={item.avatar} />
              <span className={"barrage-content"}>
                恭喜{item.name}抽中了{item.grade}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Barrage = React.forwardRef<unknown, Partial<BarrageProps>>(
  InternalBarrage
);

Barrage.defaultProps = defaultProps;
Barrage.displayName = "NutBarrage";
