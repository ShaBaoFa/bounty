export default {
  pages: [
    "pages/home/index",
    "pages/matchless/index",
    "pages/boutiqueBag/index",
    "pages/mine/index",
    "pages/webview/index",
    "pages/article/index",
  ],
  subPackages: [
    {
      root: "subRaffle",
      pages: [
        "classicsRaffle/index",
        "matchlessRaffle/index",
        "gashaponRaffle/index",
        "cardExtractor/index",
        "cardRaffle/index",
        "clipCardRaffle/index",
        "moneyBack/index",
        "txlist/index",
      ],
    },
    {
      root: "subMine",
      pages: [
        "ranking/index",
        "coupon/index",
        "rebate/index",
        "recharge/index",
        "myPulse/index",
        "dailyEntrust/index",
        "raffleRecord/index",
        "updateuser/index",
      ],
    },
    {
      root: "subPages",
      pages: [
        "selectBox/index",
        "dailyRewards/index",
        "orderList/index",
        "inviteList/index",
        "rebateList/index",
      ],
    },
  ],
  requiredPrivateInfos: ["chooseAddress"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#0B0B0B",
    navigationBarTitleText: "SHOW潮赏",
    navigationBarTextStyle: "white",
  },
  tabBar: {
    custom: true,
    color: "#BABABA",
    selectedColor: "#000000",
    backgroundColor: "#0B0B0B",
    list: [
      {
        pagePath: "pages/home/index",
      },
      {
        pagePath: "pages/matchless/index",
      },
      {
        pagePath: "pages/boutiqueBag/index",
      },
      {
        pagePath: "pages/mine/index",
      },
    ],
  },
};
