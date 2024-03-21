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

  const [recordList, setRecordList] = useState<any[]>([]);

  useEffect(() => {
    getuserhistoryList(1);
  }, []);

  const getuserhistoryList = async (currentPage?) => {
    const res = await mineApi.getuserhistoryList({ page: currentPage || page });
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
      getuserhistoryList();
    }
  };

  return (
    <div className="record-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        抽赏记录
      </NavBar>
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
              <span className="name">
                『{item.type}』第{item.nums}箱{" "}
              </span>
            </div>
            <div className="content">
              <div>系列: {item.plays}</div>
              <div>
                抽{item.num}发，使用余额{item.money}
              </div>
              <div>{item.lottery_desc}</div>
            </div>
            <div className="time-wrap">
              <span className="time">{item.updated_at}</span>
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
