import React, { useEffect, useState } from "react";
import { useRouter } from "@tarojs/taro";
import { Image, RichText } from "@tarojs/components";
import homeApi from "@src/apis/home";

import "./index.less";

function Article() {
  const { params } = useRouter();
  const [content, setContent] = useState("");
  console.log(params.image);

  useEffect(() => {
    getArticle();
  }, [params.id]);

  const getArticle = async () => {
    const res = await homeApi.getArticle({ id: params.id });
    formatRichText(res.data.contents);
  };

  const formatRichText = (html) => {
    let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
      match = match
        .replace(/style="[^"]+"/gi, "")
        .replace(/style='[^']+'/gi, "");
      match = match
        .replace(/width="[^"]+"/gi, "")
        .replace(/width='[^']+'/gi, "");
      match = match
        .replace(/height="[^"]+"/gi, "")
        .replace(/height='[^']+'/gi, "");
      return match;
    });
    newContent = newContent.replace(
      /style="[^"]+"/gi,
      function (match, capture) {
        match = match
          .replace(/width:[^;]+;/gi, "max-width:100%;")
          .replace(/width:[^;]+;/gi, "max-width:100%;");
        return match;
      }
    );
    newContent = newContent.replace(/<br[^>]*\/>/gi, "");
    newContent = newContent.replace(
      /\<img/gi,
      '< img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
    );
    setContent(newContent);
  };
  return (
    <div className="article-wrap">
      <div className="img-wrap">
        <Image className={"img"} src={params.img} mode="widthFix"></Image>
      </div>
      <div className="content-wrap">
        <RichText nodes={content}></RichText>
      </div>
    </div>
  );
}

export default Article;
