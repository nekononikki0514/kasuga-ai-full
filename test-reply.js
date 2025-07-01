// test-reply.js

import { reply } from "./lib/reply.js";

// 模擬輸入訊息與使用者
const input = {
  user: "製作人",
  topic: "午安",         // 這會觸發 fallback 判斷
  context: ""           // 模擬沒帶入過去訊息
};

const result = reply(input);

console.log("=== 測試輸出 ===");
console.log(result);

