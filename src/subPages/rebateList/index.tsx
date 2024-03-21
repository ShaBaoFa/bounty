import react, { useEffect, useState } from "react";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image, ScrollView } from "@tarojs/components";
import mineApi from "@src/apis/mine";

import "./index.scss";

const RebateList = () => {
  const [page, setPage] = useState(1);
  const [isInfiniting, setIsInfiniting] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [rebateList, setRebateList] = useState<any[]>([]);

  useEffect(() => {
    getFslist(1);
  }, []);

  const getFslist = async (currentPage?) => {
    const res = await mineApi.getFslist({ page: currentPage || page });
    if ((currentPage || page) === 1) {
      setRebateList(res.list);
    } else {
      setRebateList([...rebateList, ...res.list]);
    }
    setPage(currentPage ? currentPage + 1 : page + 1);
    if (res.list.length < 10) {
      setHasMore(false);
      setIsInfiniting(false);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      getFslist();
    }
  };

  return (
    <div className="rebate-list-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        返水明细
      </NavBar>
      <ScrollView
        className="rebate-list"
        scrollY
        scrollWithAnimation
        enableFlex
        lowerThreshold={50}
        upperThreshold={200}
        onScrollToLower={() => loadMore()}
      >
        {rebateList.map((item) => (
          <div className="rebate-item">
            <Image className="avatar" src={item.avatar}></Image>
            <div className="content">
              <div className="name">{item.name}</div>
              <div className="time">{item.created_at}</div>
            </div>
            {item.state !== 0 ? (
              <div className="status">审核中</div>
            ) : (
              <div className="taid">+ {item.retutn_point}</div>
            )}
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

export default RebateList;
