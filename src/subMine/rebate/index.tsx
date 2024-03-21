import Taro, { useRouter } from "@tarojs/taro";
import { useEffect, useState } from "react";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import { observer } from "mobx-react";
import NavBar from "@src/components/Navbar";
import Button from "@src/components/Button";
import Popup from "@src/components/popup";
import { Image } from "@tarojs/components";
import mineApi from "@src/apis/mine";
import tokenStore from "@src/store/token";

import "./index.scss";

const Rebate = () => {
  const { params } = useRouter();
  const [showBasic, setShowBasic] = useState(false);

  const [rebateInfo, setRebateInfo] = useState<any>({});

  useEffect(() => {
    getFsinfo();
  }, []);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setTimeout(() => {
      getFsinfo();
      binduserFs(params.id);
    }, 1200);
  }, [params.id]);

  const getFsinfo = async () => {
    const res = await mineApi.getFsinfo({});
    setRebateInfo(res);
  };

  const binduserFs = async (id) => {
    const res = await mineApi.binduserFs({
      id: id,
    });
    Taro.showToast({
      icon: "none",
      title: res.msg,
    });
  };

  Taro.useShareAppMessage((res) => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    // return {
    //   title: "SHOW潮赏|潮玩手办一番赏,第" + No.value + "箱,就差你一个～",
    //   path: "/moduleA/pages/goods/index?id=" + id.value + "&No=" + No.value + "&userid=" + 1,
    //   imageUrl: url.value + box.value.banner,
    // };
    return {
      title:
        tokenStore.userinfo.nickname,
      path:
        "/subMine/rebate/index?id=" + (tokenStore.userinfo.u_id * 1 - 80000),

    };
  });

  return (
    <div className="rebate-wrap">
      <NavBar
        fixed={false}
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        叠码返水
      </NavBar>
      <div className="personal-wrap">
        <div className="personal-info">
          <div className="avatar">
            <Image className="img" src={tokenStore.userinfo.avatar} />
          </div>
          <div className="container">
            <div className="name">{tokenStore.userinfo.user_level?.name}</div>
            <div className="tag">太豆: {tokenStore.userinfo.taid}</div>
          </div>
        </div>
        <div className="right" onClick={() => setShowBasic(true)}>
          返水规则
          <Image
            className="icon"
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAAAAXNSR0IArs4c6QAABGNJREFUWEfNWE2IllUYPQdctGyhoNQiUQhBSaiowNCFoaCCkaCCkKFQkZLiiLYQJ1AsVJxoBMWiCYpcBBm5SHQTFREpKCW6GKhFUFCLFoEtghNneO505/2+9733HWbhs/r43vtz7vOc55e4D4WzwSRpHoDHAawBsBTAIwAejLP+AvArgJ8AfAPgBsl/+9zTC5SkJQD2AdgGYH7lRX8C+AjABMlbNXuqQEl6CMAxADsAWEuzlYsA9pP8veuAIihJLwIYy8zj82yOywC+BHAbwF2S1ggkLQTwMICnAKwHsBbAAxmIfwC8QvLDNmCtoII3ZwDsyTabLwb4Dkn/Lookc+1lACMNk58C8MYwvg0FFYA+AbAlu3UiVF8Fpok2NOhHmo9JPgWwvQmsDdTJeFkyldX9flEtFQskWWvWdjLpOMm9+dYBUMEha8Vi+28meaXivuolktYFJ5PT7Mw5NgNUqPjn7BXW0Pnq23osDI2diy2mxAqSjm9ogjKPks0vktxec09wcDWA5fEgu/xXJH/p2i/pAwA7Y43j2EszQEl6DMDNWGD3NvLOeOK1kl4AMA7AoaAppsGrJE2DAQnPtGXsoQ4zy0hOTmtKkj3D0dpymOTbJS1J2grAATGJzfB3xKn03yWSz7edJekogNH4PkX6KVCh/t8ijvhVi0pxSJK9x6+0hmY4hKSVAL7IwD1J8nqHtv6ITGELLUqgngbwXWy6THJThZY2hAd56SjJN/M9kg4AcIC0jJA83aGtz+zl8f2ZBCo/YA/JsxWgDgF4K9ZtIum0My3BNQfHoaAbax27kiceTqByL2hVdeMgmy2Re5KkuZSDyjm6g+THHZpaBeDr+P5eAnU1Eqf/N5+KXtelSUk27aXgSZGjklwGmVeWawnUDwCe8D8ki5VDAZBDhD3S0dqAtpH8vIIOijXX5xRUQ0M255baFCVpAFRuvgWpNiq9bgjHUoqyhtaS/LbmjEhvDkkzzHcBwO7481mSrq17SSOXHSN5pPYASaaOKWSZSObL3XtWSVjSCWeCOPg5ktd6gHotUpW3jAwLnp1pocOtXQKnZmIgRBScw9F/Y6yZDp72lJRmnBjNq14VZtbpeN/xtiTcBBdJ2Xc7bf2fZrxQ0rtZPT6QNkqmkGSSu/+zjJHcX9oT9+bUmdqXVwluKu9EfPFrF/fRlqR7WXFYVYuF1/2YmX2le8NmkTe06Kp8sfOnSxBnAwfMG6V9koYWlU1QJquRpxZ891w1DEO4lCdhxzVbZiq9lRoHk35jbVQuaSZ9j8bBuTF1NO2NQ7YpJ71fsW+uGghJu6JMSZ3MKZIH8wf1aUar5gAdccyUcDmTGgUvrW9Gw1X9Ekdpt9tJHEdcTZ6v9cyIQ69H/Z+46vPcbHjYMTAmKpYp0Zy6KmwOKZxGPOD43vOoRNKojR6NdssDDkfqfFLjcGM69B9w5GZomQPU8jqts0Y8pzqSms62A4qaaoBzl+LRkOdUfYZm5qMnNZM1L/kPd3vhuN8WZPQAAAAASUVORK5CYII="
            }
          />
        </div>
      </div>
      <div className="cell-wrap">
        <div
          className="cell-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/subPages/inviteList/index",
            });
          }}
        >
          <div className="title">已邀请人数（人）</div>
          <div className="content">{rebateInfo.list}</div>
          <div className="icon">
            <RectRight />
          </div>
        </div>
        <div className="cell-item">
          <div className="title">今日获得返水总额（真气）</div>
          <div className="content">{rebateInfo.today}</div>
        </div>
        <div className="cell-item">
          <div className="title">返水总额（真气）</div>
          <div className="content">{rebateInfo.zfs}</div>
        </div>
        <div
          className="cell-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/subPages/rebateList/index",
            });
          }}
        >
          <div className="title">返水明细</div>
          <div className="icon">
            <RectRight />
          </div>
        </div>
      </div>
      <div className="btn-wrap">
        <Button className="btn" shape="square" openType="share">
          分享立即邀请新人
        </Button>
      </div>
      <Popup
        visible={showBasic}
        title="返水规则"
        onClose={() => {
          setShowBasic(false);
        }}
      >

      </Popup>
    </div>
  );
};

export default observer(Rebate);
