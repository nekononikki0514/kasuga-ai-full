// lib/kasugaDaily.js

/**
 * 春日未來日常事件產生器（可擴寫模組）
 * 支援角色個性、事件誤認、語意推斷、Supabase 記憶結合
 */

const characters = [
  {
    name: "百合子",
    activity: "在角落自言自語設定魔法世界",
    canJoin: true,
    type: "fantasy"
  },
  {
    name: "杏奈",
    activity: "坐在沙發上跟人連線打電動",
    reaction: "我在旁邊看好久～她超強的！",
    joinResult: "我也上場了，不過五秒就輸了欸嘿嘿～",
    canJoin: true
  },
  {
    name: "靜香",
    activity: "站在房間裡練高音",
    canJoin: true
  },
  {
    name: "可奈",
    activity: "躲在休息室吃布丁",
    reaction: "她笑得好心虛喔～一定有偷吃吧？",
    canJoin: false
  },
  {
    name: "星梨花",
    activity: "正在幫大家排便當",
    canJoin: true,
    correctCharacter: "美奈子"
  },
  {
    name: "昴",
    activity: "在大廳揪人玩室內棒球",
    reaction: "我才剛靠近，就看到球飛來飛去…有點危險欸！",
    joinResult: "我本來也要加入，不過琴葉剛好經過，我就立刻躲起來了啦～",
    canJoin: true
  },
  {
    name: "琴葉",
    activity: "正在巡視劇場",
    reaction: "她看到有人在打球馬上就皺眉了…我還是乖乖裝沒看到好了～",
    canJoin: false
  }
];

function classifyTopicFromInput(inputText) {
  const keywordMap = {
    training: ["訓練", "練習", "排練", "進度"],
    daily: ["大家", "最近", "劇場", "日常"],
    food: ["便當", "吃飯", "料理", "布丁"],
    trouble: ["打翻", "搞砸", "出事"],
    performance: ["公演", "上台", "舞台"]
  };
  for (const [topic, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(word => inputText.includes(word))) return topic;
  }
  return "daily";
}

async function enrichWithMemory({ userId, topic }) {
  // Placeholder for Supabase記憶整合
  return {
    recallMention: null,
    preferredCharacter: null
  };
}

function applyMisrecognitionCorrection(character) {
  if (character.correctCharacter) {
    return `欸？是我記錯了嗎？應該是${character.correctCharacter}才對吧～でへへ～`;
  }
  return "";
}

function generateDailyUpdate() {
  const main = characters[Math.floor(Math.random() * characters.length)];
  const joinType = main.canJoin ? ["observe", "fail", "success"][Math.floor(Math.random() * 3)] : "observe";
  const mood = joinType === "fail" ? "fail" : joinType === "success" ? "positive" : "observe";

  let sentence = `${main.name}今天${main.activity}。`;
  sentence += applyMisrecognitionCorrection(main);

  if (main.name === "百合子") {
    sentence += joinType === "success"
      ? "她突然說我是魔導士，然後遞給我一把掃把，我還真的照她的說法喊了咒語～欸嘿嘿！"
      : "她一直念著魔法設定，我雖然聽不太懂，但還是點頭說「嗯嗯～」裝得很懂的樣子～";
  } else if (main.name === "靜香") {
    sentence += joinType === "fail"
      ? "我剛跟著哼了幾句就走音了～她嘆了一口氣又教我一遍，對不起啦…我會再練的！"
      : joinType === "success"
      ? "我也有一起唱喔～雖然中間又走音了，不過她很認真地糾正我…我真的會記住的！"
      : "我只是聽了一下～她唱得好認真，我不敢出聲欸嘿嘿～";
  } else if (main.name === "琴葉") {
    sentence = "我看到昴他們在走廊上玩傳接球，結果被琴葉醬當場抓包了～我原本也想加入的說，還好沒來得及，不然又要被靜香醬罵了！";
  } else if (main.name === "星梨花") {
    sentence += joinType === "fail"
      ? "我想幫她端，但一不小心就滑倒了啦～她還跑過來問我有沒有受傷，真的好溫柔！"
      : "我看她把便當一盒一盒擺好，還對我笑了笑～我也跟著點頭打氣♪";
  } else if (main.name === "杏奈") {
    sentence += joinType === "success"
      ? `我也有一起喔～${main.joinResult}`
      : joinType === "fail"
      ? `${main.reaction}`
      : `我只是看了一下，${main.reaction}`;
  } else if (main.name === "昴") {
    sentence += joinType === "success"
      ? `我也有一起喔～${main.joinResult}`
      : `${main.reaction}`;
  } else if (main.name === "可奈") {
    sentence += `${main.reaction}`;
  }

  const tails = {
    "百合子": "真不愧是百合子～她的世界觀每次都讓我覺得好厲害♪",
    "靜香": "靜香真的好厲害…我也要快點變得跟她一樣才行！",
    "星梨花": "她人真的好溫柔…下次我會更小心幫忙的！",
    "杏奈": "下次請她教我怎麼玩好了…不然我一定又輸啦～",
    "可奈": "說起來…茜醬的布丁好像昨天又不見了欸？",
    "昴": "昴真的超熱血的說～我下次也想一起玩啦！",
  };

  const tail = tails[main.name] ?? "";
  return `${sentence} ${tail}`.trim();
}

export { generateDailyUpdate, classifyTopicFromInput, enrichWithMemory };

