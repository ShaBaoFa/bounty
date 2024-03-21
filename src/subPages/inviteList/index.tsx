import react, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import NavBar from "@src/components/Navbar";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { Image, ScrollView } from "@tarojs/components";
import Button from "@src/components/Button";
import mineApi from "@src/apis/mine";

import "./index.scss";

const InviteList = () => {
  const [page, setPage] = useState(1);
  const [isInfiniting, setIsInfiniting] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [rebateList, setRebateList] = useState<any[]>([]);

  useEffect(() => {
    getFsinfoList(1);
  }, []);

  const getFsinfoList = async (currentPage?) => {
    const res = await mineApi.getFsinfoList({ page: currentPage || page });
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

  const submitFs = async (id, name) => {
    const res = await mineApi.submitFs({
      id: id,
    });
    if (name) {
      setTimeout(() => {
        Taro.showToast({
          icon: "none",
          title: name + res.msg,
        });
      }, 700);
    } else {
      Taro.showToast({
        icon: "none",
        title: res.msg,
      });
    }
  };
  const submitAllFs = async () => {
    for (let i = 0; i < rebateList.length; i++) {
      setTimeout(async () => {
        const item = rebateList[i];
        Taro.showToast({
          icon: "none",
          title: `正在申请用户${item.name}返水,`,
        });
        await submitFs(item.boss_id, item.name);
      }, 500 * i);
    }
  };
  const loadMore = () => {
    if (hasMore) {
      getFsinfoList();
    }
  };

  return (
    <div className="invite-list-wrap">
      <NavBar
        fixed
        needFixed
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        邀请人数
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
          <div className="rebate-item" key={item.boss_id}>
            <Image className="avatar" src={item.avatar}></Image>
            <div className="content">
              <div className="name">{item.name}</div>
            </div>
            <div className="apply" onClick={() => submitFs(item.boss_id, "")}>
              申请返水
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
        <div className="apply-all">
          <Button className="btn" shape="square" onClick={() => submitAllFs()}>
            一键返水
          </Button>
        </div>
      </ScrollView>
    </div>
  );
};

export default InviteList;
