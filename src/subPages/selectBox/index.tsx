import { useState } from "react";
import Taro from "@tarojs/taro";
import { RectLeft, RectRight } from "@nutui/icons-react-taro";
import NavBar from "@src/components/Navbar";
import classnames from "classnames";
import { Image } from "@tarojs/components";

import raffleStore from "@src/store/raffleStore";
import selectBoxApi from "@src/apis/selectBox";

import "./index.scss";
import { useDidShow } from "@tarojs/taro";

const SelectBox = () => {
  const [allPages, setPages] = useState<any[]>([]);
  const [currentBox, setCurrentBox] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("全部");
  const [classify, setClassify] = useState([]);
  const [boxList, setBoxList] = useState<any[]>([]);

  useDidShow(() => {
    getBoxListPage();
  });
  const getBoxListPage = async () => {
    const res = await selectBoxApi.getBoxListPage({
      plays_id: raffleStore.boxId,
    });
    if (res.code === 200) {
      const pageArr: any = [];
      const allPage = Math.ceil(res.box_num / 100);
      for (let index = 0; index < allPage; index++) {
        const start = index * 100 + 1;
        const end =
          index === allPage - 1 ? res.box_num % 100 : (index + 1) * 100 + 1;
        pageArr.push({ startBox: start, endBox: end });
      }
      setPages(pageArr);
      setCurrentBox(0);
      setCurrentLevel(res.gradelist[0]);
      setClassify(res.gradelist);
      getBoxList();
    }
  };

  const getBoxList = async () => {
    const res = await selectBoxApi.getBoxList({
      box_index: currentBox,
      plays_id: raffleStore.boxId,
      type: raffleStore.boxType,
      tag: currentLevel,
    });
    if (res.code === 200) {
      setBoxList(res.list);
    }
  };
  return (
    <div className="select-box-wrap">
      <NavBar
        fixed={false}
        back={
          <>
            <RectLeft color="#979797" />
          </>
        }
      >
        选择赏箱
      </NavBar>
      <div className="page-wrap">
        {allPages.map((item, index) => {
          return (
            <div
              className={classnames(
                "page-item",
                currentBox === index && "selected"
              )}
              onClick={() => {
                setCurrentBox(index);
              }}
            >
              <div className="page">
                <span>{item.startBox}</span> ~ <span>{item.endBox}</span>箱
              </div>
            </div>
          );
        })}
      </div>
      <div className="level-wrap">
        {classify.map((item, index) => (
          <div
            className={classnames(
              "level-item",
              currentLevel === item && "selected"
            )}
            onClick={() => setCurrentLevel(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="classify-list">
        {boxList.map((item, index) => (
          <div
            className="classify-item"
            onClick={() => {
              raffleStore.setBoxNo(item[0].No);
              Taro.navigateBack();
            }}
          >
            <div className="classify-index">
              {index + 1}箱
              <Image
                className="bg"
                src={"https://api.zeecheese.top/assets/icon/box@2x.png"}
              ></Image>
            </div>
            <div className="classify-content">
              {item.map((child) => (
                <div
                  className={classnames(
                    "item",
                    child.total - child.ex_num <= 0 && "disabled"
                  )}
                >
                  <span
                    className={classnames(
                      "classify",
                      currentLevel === child.grade && "selected"
                    )}
                  >
                    {child.grade.replace("赏", "")}
                  </span>
                  <span className="ice">
                    {child.total - child.ex_num}/{child.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectBox;
