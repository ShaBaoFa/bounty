import Taro, { useDidShow } from "@tarojs/taro";
import { Image, Input } from "@tarojs/components";
import Button from "@src/components/Button";
import CheckBox from "@src/components/Checkbox";
import { RectRight } from "@nutui/icons-react-taro";
import CartGoodsCard from "./components/CartGoodsCard";
import Dialog from "@src/components/Dialog";
import Popup from "@src/components/popup";
import mineApi from "@src/apis/mine";

import "./index.scss";
import { useState, useEffect } from "react";

const BoutiqueBag = () => {
  const [showBasic, setShowBasic] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState<any[]>([]);
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [splitList, setSplitList] = useState<any[]>([]);
  const [foldList, setFoldList] = useState<any[]>([]);
  const [cartGoods, setCartGoods] = useState<any[]>([]);
  const [checkedTotal, setCheckedTotal] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [basicVisible, setBasicVisible] = useState(false);
  const [showAddressBasic, setShowAddressBasic] = useState(false);
  const [address, setAddress] = useState<any>({});
  const [remarks, setRemarks] = useState<any>("");

  useDidShow(() => {
    if (showAddressBasic) return;
    getInventory();
  });

  const getInventory = async () => {
    const res = await mineApi.getInventory();
    if (res.code === 200) {
      let splitArray: any[] = [];
      res.list.forEach((item) => {
        const childArray: any[] = new Array(item.num).fill({});
        childArray.forEach((child, index) => {
          childArray[index] = {
            ids: item.ids,
            kit: {
              ...item.kit,
              number: 1,
            },
            kit_id: item.kit_id,
            num: 1,
          };
        });
        splitArray = [...splitArray, ...childArray];
      });
      setCheckedList([]);
      setCheckedNumber([]);
      setSplitList(splitArray);
      setFoldList(res.list);
      setCartGoods(res.list);
    }
  };

  const onChecked = (checked, index) => {
    if (checked) {
      const newArray = [...checkedNumber];
      const findIndex = newArray.indexOf(index);
      if (findIndex > -1) {
        newArray.splice(findIndex, 1);
      }
      setCheckedNumber(newArray);
    } else {
      setCheckedNumber([...checkedNumber, index]);
    }
  };

  const onCheckedAll = (checked) => {
    if (cartGoods.length === 0) {
      return;
    }
    if (checked) {
      setCheckedNumber([]);
    } else {
      const checkedArray: any[] = [];
      cartGoods.forEach((item, index) => {
        checkedArray.push(index);
      });
      setCheckedNumber(checkedArray);
    }
  };

  const applyRefund = async (submit = false) => {
    if (checkedNumber.length === 0) {
      Taro.showToast({
        icon: "none",
        title: "请选择至少一件",
      });
      return;
    }
    if (submit) {
      setVisible(true);
      getAllInfo();
    }
  };

  const getAllInfo = () => {
    let totalNumber = 0;
    let total = 0;
    checkedList.forEach((item) => {
      totalNumber += item.num || 1;
      total += (item.num || 1) * item.kit.point;
    });
    setCheckedTotal({
      total,
      totalNumber,
    });
  };

  const submitApplyRefund = async () => {
    const ids = {};
    checkedList.forEach((item) => {
      if (ids[item.kit_id]) {
        ids[item.kit_id] = ids[item.kit_id] + item.num;
      } else {
        ids[item.kit_id] = item.num;
      }
    });
    const res = await mineApi.decompose({
      ids: JSON.stringify(ids),
    });
    if (res.code === 200) {
      setVisible(false);
      getInventory();
    } else {
      Taro.showToast({
        icon: "error",
        title: res.msg,
      });
    }
  };

  const packSend = async (submit = false) => {
    if (checkedNumber.length === 0) {
      Taro.showToast({
        icon: "none",
        title: "请选择至少一件",
      });
      return;
    }
    setShowAddressBasic(true);
    getAllInfo();
    if (submit) {
      const ids = {};
      checkedList.forEach((item) => {
        if (ids[item.kit_id]) {
          ids[item.kit_id] = ids[item.kit_id] + item.num;
        } else {
          ids[item.kit_id] = item.num;
        }
      });
      const params = {
        ids: JSON.stringify(ids),
        address:
          address.provinceName +
          address.cityNam +
          address.countyName +
          address.detailInfo,
        name: address.userInfo,
        tel: address.telNumber,
        remarks: remarks,
        num: checkedList.length,
      };
      const res = await mineApi.addOrder(params);
      if (res.code === 200) {
        getInventory();
      } else {
        Taro.showToast({
          icon: "error",
          title: res.msg,
        });
      }
    }
  };

  useEffect(() => {
    getChooseList();
  }, [checkedNumber]);

  const getChooseList = () => {
    const chooseArray: any[] = [];
    cartGoods.forEach((item, index) => {
      if (checkedNumber.includes(index)) {
        chooseArray.push(item);
      }
    });
    setCheckedList(chooseArray);
    return chooseArray;
  };

  return (
    <div className="boutique-wrap">
      <div className="logo-wrap">
        <Image
          className="logo"
          src={require("./../../assets/icon/赏袋@2x.png")}
        />
      </div>
      <div className="boutique-container">
        <div className="header">
          <div className="explain" onClick={() => setShowBasic(true)}>
            <Image
              className="icon"
              src={
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAAAAXNSR0IArs4c6QAABGNJREFUWEfNWE2IllUYPQdctGyhoNQiUQhBSaiowNCFoaCCkaCCkKFQkZLiiLYQJ1AsVJxoBMWiCYpcBBm5SHQTFREpKCW6GKhFUFCLFoEtghNneO505/2+9733HWbhs/r43vtz7vOc55e4D4WzwSRpHoDHAawBsBTAIwAejLP+AvArgJ8AfAPgBsl/+9zTC5SkJQD2AdgGYH7lRX8C+AjABMlbNXuqQEl6CMAxADsAWEuzlYsA9pP8veuAIihJLwIYy8zj82yOywC+BHAbwF2S1ggkLQTwMICnAKwHsBbAAxmIfwC8QvLDNmCtoII3ZwDsyTabLwb4Dkn/Lookc+1lACMNk58C8MYwvg0FFYA+AbAlu3UiVF8Fpok2NOhHmo9JPgWwvQmsDdTJeFkyldX9flEtFQskWWvWdjLpOMm9+dYBUMEha8Vi+28meaXivuolktYFJ5PT7Mw5NgNUqPjn7BXW0Pnq23osDI2diy2mxAqSjm9ogjKPks0vktxec09wcDWA5fEgu/xXJH/p2i/pAwA7Y43j2EszQEl6DMDNWGD3NvLOeOK1kl4AMA7AoaAppsGrJE2DAQnPtGXsoQ4zy0hOTmtKkj3D0dpymOTbJS1J2grAATGJzfB3xKn03yWSz7edJekogNH4PkX6KVCh/t8ijvhVi0pxSJK9x6+0hmY4hKSVAL7IwD1J8nqHtv6ITGELLUqgngbwXWy6THJThZY2hAd56SjJN/M9kg4AcIC0jJA83aGtz+zl8f2ZBCo/YA/JsxWgDgF4K9ZtIum0My3BNQfHoaAbax27kiceTqByL2hVdeMgmy2Re5KkuZSDyjm6g+THHZpaBeDr+P5eAnU1Eqf/N5+KXtelSUk27aXgSZGjklwGmVeWawnUDwCe8D8ki5VDAZBDhD3S0dqAtpH8vIIOijXX5xRUQ0M255baFCVpAFRuvgWpNiq9bgjHUoqyhtaS/LbmjEhvDkkzzHcBwO7481mSrq17SSOXHSN5pPYASaaOKWSZSObL3XtWSVjSCWeCOPg5ktd6gHotUpW3jAwLnp1pocOtXQKnZmIgRBScw9F/Y6yZDp72lJRmnBjNq14VZtbpeN/xtiTcBBdJ2Xc7bf2fZrxQ0rtZPT6QNkqmkGSSu/+zjJHcX9oT9+bUmdqXVwluKu9EfPFrF/fRlqR7WXFYVYuF1/2YmX2le8NmkTe06Kp8sfOnSxBnAwfMG6V9koYWlU1QJquRpxZ891w1DEO4lCdhxzVbZiq9lRoHk35jbVQuaSZ9j8bBuTF1NO2NQ7YpJ71fsW+uGghJu6JMSZ3MKZIH8wf1aUar5gAdccyUcDmTGgUvrW9Gw1X9Ekdpt9tJHEdcTZ6v9cyIQ69H/Z+46vPcbHjYMTAmKpYp0Zy6KmwOKZxGPOD43vOoRNKojR6NdssDDkfqfFLjcGM69B9w5GZomQPU8jqts0Y8pzqSms62A4qaaoBzl+LRkOdUfYZm5qMnNZM1L/kPd3vhuN8WZPQAAAAASUVORK5CYII="
              }
            />
            发货说明
          </div>
          <div className="operation">
            <Button
              className="btn"
              shape="square"
              onClick={() => {
                setCartGoods(splitList);
                setCheckedNumber([]);
              }}
            >
              拆分
            </Button>
            <Button
              className="btn"
              shape="square"
              onClick={() => {
                setCartGoods(foldList);
                setCheckedNumber([]);
              }}
            >
              堆叠
            </Button>
          </div>
        </div>
        <div className="cart-goods-wrap">
          {cartGoods &&
            cartGoods.map((item, index) => (
              <CartGoodsCard
                key={item.kit_id + index}
                info={item}
                checked={checkedNumber.includes(index)}
                onClick={(checked) => {
                  onChecked(checked, index);
                }}
              ></CartGoodsCard>
            ))}
        </div>
        <div className="footer">
          <div className="choose">
            <span className="check-all">
              <CheckBox
                checked={
                  cartGoods.length > 0 &&
                  cartGoods.length === checkedNumber.length
                }
                onClick={(checked, e) => {
                  onCheckedAll(checked);
                }}
              >
                全选
              </CheckBox>
            </span>
            <span className="checked">已选 {checkedNumber.length}</span>
            <span
              className="refresh"
              onClick={() => {
                setCheckedNumber([]);
                getInventory();
              }}
            >
              <Image
                className="icon"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAAXNSR0IArs4c6QAAA1xJREFUWEe9mD2IV0cUxX8HUlhYpEihxMJFiwiKKQIKGlQ0RNCQFSwUIloIGozgEtMpGhQ0qKAoJIKgYiBKiljYBCIqKiJsEXGLiIKKAQWLWFgICjecZd7yHN/X/v+7TrPLvpl7zv2Ye8+s6GNFxAHgvKQ7vZpRrwd9LiL+AFYCB4GfJL0ar72JIDCYQIeBbyTdGw+JiSRgXEdgh6STXUn0TCAipgJOwYoKsKvAJkmP24h0JhARswCH2zn/DPiwxfhL4DtJZ5v2tRKIiCXAXmBpmzc1388DQ5KeVX2vJRARHwMnktc9Yo8dM/jnkh7khioJJK9/BWb0iwz8A2yVdK1TBCLiS+AiMKUG3JV+A/gbWA180rCvtT+8FYGIWAT8VQPu8O0HLhQNJzWiog+UefgWfCvJ3jeuMQIRMQ24BczMTrwBdgFHJPn3sVVB4EXqA42VX7ZRJnDOnSwDd7gHJf1Z5UZG4EyqdpPovEYJRMT8lNPyQXu7ug48nXMjcg3UFlkbk4KADeW53C9pd5OBiFgFXO5lCBV2FREfAU+ywvO9HejHcJvnZQIbAeevvHZKOtLVSD/7HIGq4pte1zr7Aas6awJ3gbmljyOS5k00UJ09E/gvm2yWWOvfJ4HIwE5I2v4+CbwGPigBThqBiFiQzw6n4Dngq1isi5LWTEYEIuJ3YG3J9gsTuA4sLv3xkaSBSSJwH5hdsj1sAj+7lWaAc7pMsvGQjAgPuYfZmVMm8HWa/+VvhyX9MB6Atr0RcQjYme1bZwIWHk+zq+iJNk/Sv22Gu3xPo97el0WORev0Yhgdt4LNjF2S9FUXgLY9EfEbsC7bd1TSUEHA2s8FksuwvZJ+bANo+h4Re5KqLm+zzvCwe1YWJN8DhyuM9UwiIvYlNZWbHbNZJuBmdCW7ksXBzi8dH0iPmKNJtObgFrRfFKM+F6VOhftCrgttxGGzVPfovl2hD+2AlZVryfmuUtWPgGWS/HN0vfMuSPfVkagiUZxzBVvxWrhYulnQeqL6vVi33gGvJJBC6Eicrnl49lKTTuGGqmvd9DRzSLekfz40edZEyP3Eb4ljecpqU5BbS01kG7A5hbpLBJyaXxJwo0xvfR0XaBHhiCwElgOfphopnugGcY5H0svqZp3HOfv/AfmVMzoWa6lQAAAAAElFTkSuQmCC"
              ></Image>
              刷新
            </span>
          </div>
          <div className="operation">

            <Button
              className="btn"
              size="large"
              shape="square"
              onClick={() => packSend()}
            >
              打包发货
            </Button>
          </div>
        </div>
      </div>


      <Dialog
        title="温馨提示"
        visible={basicVisible}
        hideCancelButton
        confirmText="收到"
        onConfirm={() => {
          setBasicVisible(false);
        }}
      >
        发货订单价值总和低于50太豆无法发货，请前往凑单或者联系客服补邮费噢~
      </Dialog>

      <Popup
        visible={showBasic}
        title="发货说明"
        onClose={() => {
          setShowBasic(false);
        }}
      >
        <div className="explain-content">
          <div>
            1、物流发货公告：“SHOW潮赏皆带有出荷信息，5件起包邮，5件内邮费10元，用户可点击查询快递单号，非偏远地区3日达，偏远地区物流运输时间按实际情况延长。
          </div>
          <div>2、现货产品在无不可抗力情况下将在用户申请后1-7天内发货；</div>
          <div>
            3、预售产品已注明出荷时间，到期会转为现货，供用户申请发货，其具体发货时间会受制作周期，物流周期，质检返工等诸多因素影响而推迟，详情可咨询客服。”
          </div>
        </div>
      </Popup>

      <Popup
        visible={showAddressBasic}
        isRenderTitle={false}
        position="bottom"
        round
        zIndex={99999}
        footer={
          <>
            <Button
              className="confirm-btn"
              shape="square"
              size="large"
              bgColor="#B94641"
              isWhite={false}
              style={{ color: "#ffffff" }}
              onClick={() => {
                if (checkedTotal.total < 50) {
                  setBasicVisible(true);
                } else {
                  packSend(true);
                }
              }}
            >
              确认打包
            </Button>
          </>
        }
        onClose={() => setShowAddressBasic(false)}
      >
        <div className="address-wrap">
          <div className="prize-list">
            {checkedList.map((item) => (
              <div className="prize-item" key={item.kit_id}>
                <div className="img">
                  <Image
                    className="image"
                    src={
                      "https://api.zeecheese.top/storage/" + item.kit.image
                    }
                    mode="scaleToFill"
                  ></Image>
                </div>
                <div className="content">
                  <div className="name">{item.kit.name}</div>
                  <div className="number">X {item.num} </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="address"
            onClick={() => {
              Taro.chooseAddress({
                success: (res) => {
                  console.log(res);
                  if (res.errMsg === "chooseAddress:ok") {
                    setAddress(res);
                  }
                },
              });
            }}
          >
            <div className="label">收获地址</div>
            {address.userName ? (
              <div className="address-info">
                <div className="name">
                  {address.userName} - {address.telNumber}
                </div>
                <div className="info">
                  {address.provinceName}
                  {address.cityName}
                  {address.countyName}
                  {address.detailInfo}
                </div>
              </div>
            ) : (
              <div className="placeholder">请选择地址</div>
            )}
            <RectRight color="#666666" />
          </div>
          <div className="remarks">
            <div className="label">备注</div>
            <Input
              className="remarks-input"
              value={remarks}
              placeholder="请输入备注信息"
              onInput={(e) => setRemarks(e.detail.value)}
            ></Input>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default BoutiqueBag;
