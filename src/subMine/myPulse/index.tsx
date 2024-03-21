import Taro, { useDidShow } from "@tarojs/taro";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image, ScrollView } from "@tarojs/components";
import Button from "@src/components/Button";
import mineApi from "@src/apis/mine";
import tokenStore from "@src/store/token";

import "./index.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";

const MyPulse = () => {
  const [page, setPage] = useState(1);
  const [isInfiniting, setIsInfiniting] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentMonthStr, setCurrentMonthStr] = useState(
    dayjs().format("YYYY-MM")
  );
  const [currentMonth, setCurrentMonth] = useState(
    dayjs().format("YYYY年MM月")
  );

  const [recordList, setRecordList] = useState<any[]>([]);

  useEffect(() => {
    getRecharge(1);
  }, [currentMonthStr]);

  const getRecharge = async (currentPage?) => {
    const res = await mineApi.getrecharge({
      starttime: dayjs(currentMonthStr)
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      endtime: dayjs(currentMonthStr)
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      page: currentPage || page,
    });
    if (res.code === 200) {
      if ((currentPage || page) === 1) {
        setRecordList(res.list);
      } else {
        setRecordList([...recordList, ...res.list]);
      }
      setPage(currentPage ? currentPage + 1 : page + 1);
      if (res.list.length < 10) {
        setHasMore(false);
        setIsInfiniting(false);
      }
    } else {
      setRecordList([]);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      getRecharge();
    }
  };

  return (
    <div className="pulse-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        我的太豆
      </NavBar>
      <div className="balance-wrap">
        <div className="balance">
          <Image
            className="icon"
            src={require("../../assets/icon/Group 257@2x.png")}
          ></Image>
          <span className="number">{tokenStore.userinfo.taid}</span>
        </div>
        <div
          className="pulse-btn"
          onClick={() => {
            Taro.navigateTo({
              url: "/subMine/recharge/index",
            });
          }}
        >
          <Image
            className="img"
            src={"https://api.zeecheese.top/assets/icon/充值button@2x.png"}
          ></Image>
        </div>
      </div>

      <div className="date-wrap">
        <RectLeft
          color="#979797"
          onClick={() => {
            setCurrentMonth(
              dayjs(currentMonthStr).subtract(1, "month").format("YYYY年MM月")
            );
            setCurrentMonthStr(
              dayjs(currentMonthStr).subtract(1, "month").format("YYYY-MM")
            );
          }}
        />
        <div className="date">{currentMonth}</div>
        <RectRight
          onClick={() => {
            setCurrentMonth(
              dayjs(currentMonthStr).add(1, "month").format("YYYY年MM月")
            );
            setCurrentMonthStr(
              dayjs(currentMonthStr).add(1, "month").format("YYYY-MM")
            );
          }}
          color="#979797"
        />
      </div>
      <ScrollView
        className="record-list"
        scrollY
        scrollWithAnimation
        enableFlex
        lowerThreshold={50}
        upperThreshold={200}
        onScrollToLower={() => loadMore()}
      >
        {recordList.map((item) => (
          <div className="record-item">
            <div className="title">
              <span className="name">{item.desc}</span>
              {item.type === 1 && !item.is_pay && (
                <span className={classNames("change", "add")}>未支付</span>
              )}
              <span
                className={classNames(
                  "change",
                  item.type === 2 || item.type === 4 ? "reduce" : "add"
                )}
              >
                {item.type === 2 || item.type === 4 ? "-" : "+"} {item.money}
              </span>
            </div>
            <div className="time-wrap">
              <span className="time">{item.updated_at}</span>
              <span className="result">账户余额：{item.user_money}</span>
            </div>
          </div>
        ))}
        <div className="nut-infinite-bottom">
          {isInfiniting ? (
            <div className="bottom-box">{"加载中~"}</div>
          ) : (
            !hasMore && <div className="tips">{"没有更多了~"}</div>
          )}
        </div>
      </ScrollView>
    </div>
  );
};

export default observer(MyPulse);
