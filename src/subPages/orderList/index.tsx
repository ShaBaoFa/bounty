import { useEffect, useState } from "react";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image, ScrollView } from "@tarojs/components";
import mineApi from "@src/apis/mine";

import "./index.scss";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [isInfiniting, setIsInfiniting] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [stateMap] = useState({
    0: "未发货",
  });

  const [orderList, setOrderList] = useState<any[]>([]);

  useEffect(() => {
    getOrderList(1);
  }, []);

  const getOrderList = async (currentPage?) => {
    const res = await mineApi.getOrderList({ page: currentPage || page });
    if (res.code === 200) {
      console.log(res);
      if ((currentPage || page) === 1) {
        setOrderList(res.list);
      } else {
        setOrderList([...orderList, ...res.list]);
      }
      setPage(currentPage ? currentPage + 1 : page + 1);
      if (res.list.length < 10) {
        setHasMore(false);
        setIsInfiniting(false);
      }
    } else {
      setOrderList([]);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      getOrderList();
    }
  };

  return (
    <div className="order-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        订单
      </NavBar>
      <ScrollView
        className="order-list"
        scrollY
        scrollWithAnimation
        enableFlex
        lowerThreshold={50}
        upperThreshold={200}
        onScrollToLower={() => loadMore()}
      >
        {orderList.map((item) => (
          <div className="order-item" key={item.id}>
            <div className="prize-list">
              {item.info.map((child) => (
                <div className="prize-item" key={child.kit_id}>
                  <div className="img">
                    <Image
                      className="image"
                      src={
                        "https://api.zeecheese.top/storage/" +
                        child.kit.image
                      }
                      mode="scaleToFill"
                    ></Image>
                  </div>
                  <div className="content">
                    <div className="name">{child.kit.name}</div>
                    <div className="number">X {child.num} </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-state">{stateMap[item.state]}</div>
            <div className="cell-wrap">
              <div className="label">下单时间</div>
              <div className="input">{item.created_at}</div>
            </div>
            <div className="cell-wrap">
              <div className="label">配送地址</div>
              <div className="input">{item.address}</div>
            </div>
            <div className="cell-wrap">
              <div className="label">收货人</div>
              <div className="input">
                {item.name} - {item.tel}
              </div>
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

export default OrderList;
