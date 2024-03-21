import React, { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import { WebView } from "@tarojs/components";

function Webview() {
  const { params } = useRouter();
  const [viewUrl, setViewUrl] = useState<any>(
    "https://api.zeecheese.top/webview"
  );
  useEffect(() => {
    setViewUrl("https://api.zeecheese.top/webview?id=" + params.id);
  }, [params.id]);
  return (
    <div className="webview">
      <WebView src={viewUrl}></WebView>
    </div>
  );
}

export default Webview;
