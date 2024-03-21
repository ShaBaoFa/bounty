import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { Image } from "@tarojs/components";
import Popup from "../popup";
import Button from "../Button";
import Dialog from "@src/components/Dialog";
import mineApi from "@src/apis/mine";

import classNames from "classnames";

import "./index.scss";

const classPrefix = `nut-result-goods-card`;
const ResultCard = (props) => {
  const [dialogVisible, setVisible] = useState(false);
  const {
    visible,
    recordList,
    isModal = false,
    isJump = false,
    onClick,
    onSetVisible,
  } = props;
  const [resultList, setResultList] = useState<any[]>([]);

  useEffect(() => {
    console.log('recordList',recordList)
    const safety: any[] = [];
    const last: any[] = [];
    const first: any[] = [];
    const sssp: any[] = [];
    const ssp: any[] = [];
    const sp: any[] = [];
    const others: any[] = [];
    recordList.forEach((item) => {
      switch(item.grade) {
        case "SSSP赏":
          item.important = true;
          sssp.push(item);
          break;
        case "SSP赏":
          item.important = true;
          ssp.push(item);
          break;
        case "SP赏":
          item.important = true;
          sp.push(item);
          break;
        case "SAFETY赏":
          item.important = true;
          safety.push(item);
          break;
        case "Last赏":
          item.important = true;
          last.push(item);
          break;
        case "First赏":
          item.important = true;
          first.push(item);
          break;

        default:
          others.push(item);
          break;
      }
    });

    if (last.length|| first.length || safety.length || sssp.length || ssp.length || sp.length) {
      Taro.vibrateShort();
    }

    setResultList([...last,...first,...safety,...sssp, ...ssp, ...sp, ...others]);
  }, [recordList]);

  const getAllInfo = () => {
    let totalNumber = 0;
    let total = 0;
    recordList.forEach((item) => {
      totalNumber += item.kit.num || 1;
      total += (item.kit.num || 1) * item.kit.point;
    });
    return {
      totalNumber,
      total,
    };
  };

  const applyRefund = async () => {
    const ids = {};
    resultList.forEach((item) => {
      if (ids[item.kit_id]) {
        ids[item.kit_id] = ids[item.kit_id] + 1;
      } else {
        ids[item.kit_id] = 1;
      }
    });
    const res = await mineApi.decompose({
      ids: JSON.stringify(ids),
    });
    if (res.code === 200) {
      if (isJump) {
        Taro.showToast({
          icon: "success",
          title: res.msg,
        });
        onSetVisible(false);
        return;
      }
      Taro.navigateBack();
    } else {
      Taro.showToast({
        icon: "error",
        title: res.msg,
      });
    }
  };
  return (
    <Popup
      closeable
      visible={visible}
      title="中赏详情"
      footer={
        <>

          <Button
            className="btn btn2"
            shape="square"
            onClick={() => {
              Taro.switchTab({
                url: "/pages/boutiqueBag/index",
              });
            }}
          >
            前往赏袋
          </Button>
          <Button
            className="btn btn2"
            shape="square"
            bgColor="#ffffff"
            style={{ color: "#0b0b0b" }}
            onClick={() => {
              if (isJump) {
                onSetVisible(false);
                return;
              }
              Taro.navigateBack();
            }}
          >
            继续抽赏
          </Button>
        </>
      }
      onClose={() => {
        onSetVisible(false);
      }}
    >
      <div className="record-content">
        {resultList.map((item) => (
          <div
            key={item.kit_id}
            className={classNames(
              classPrefix,
              isModal && "small",
              item.important && "important"
            )}
            onClick={() => {}}
          >
            <div className="goods-img-wrap">
              <Image className="img" src={item.kit.image} mode="aspectFill" />
            </div>
            <div className="goods-title">{item.kit.name}</div>
            <div className="goods-title reference-price">
              {item.grade} ×{item.kit.num || 1}
            </div>
          </div>
        ))}
      </div>
      <Dialog
        title="温馨提示"
        visible={dialogVisible}
        cancelText="取消"
        confirmText="确认"
        onConfirm={() => {
          applyRefund();
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        确认退货{getAllInfo().totalNumber}个赏办，并获得{getAllInfo().total}太豆
      </Dialog>
    </Popup>
  );
};

export default ResultCard;
