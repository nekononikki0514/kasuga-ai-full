// lib/reply.js

import { generateDailyUpdate } from "./kasugaDaily";

function isRedundantOrShallow(text = '', context = '') {
  return (
    text.length < 10 ||
    /午安|加油|大家|還好嗎|辛苦/.test(text)
  );
}

export function reply({ role = '未來', user = '製作人', topic, emotion = 'default', context = '', related = '' }) {
  if (isRedundantOrShallow(topic, context)) {
    const daily = generateDailyUpdate();
    const output = `${user}～ ${daily}`;
    console.log("✅ reply() [fallback] 輸出為：", output);
    return output;
  }

  const toneMap = {
    default: ['欸嘿嘿～', '嗯嗯～', '真的嗎？', '好開心的說！'],
    happy: ['哇～太好了！', '開心開心～', '一起加油吧♪'],
    sad: ['嗚嗚…', '有點難過呢', '沒關係，我們還有明天！'],
    worried: ['欸？', '怎麼辦呢…', '我也好擔心的說'],
    embarrassed: ['啊啊…好害羞', '製作人別笑啦～', '人家會臉紅的說！'],
  };

  const starters = [
    `${user}～！`,
    `嗨嗨！${user}今天心情如何？`,
    `呀！${user}～有什麼想跟我聊的嗎？`,
  ];

  const suffixes = [
    '你覺得呢？',
    '想和我一起努力嗎？',
    '要不要一起散散步呀？',
    '下次也一起加油吧！',
  ];

  const relatedTone = {
    '星梨花醬': '昨天我又去請教星梨花醬功課了～她真的超厲害的說…但我還是只懂一點點，でへへ～',
    '杏奈醬': '今天跟杏奈醬一起玩遊戲～她OFF狀態時超舒服，結果她ON起來就超帥！果然是我超佩服的偶像♪',
    '靜香醬': '欸嘿…我是不是又做錯了什麼？靜香醬一定又要念我了啦～我有點擔心會被罵，但我知道她是為我好，而且我還是最信任她的說！',
    '可奈醬': '跟可奈醬一起笑到肚子痛啦～我們真的有時候會鬧過頭欸♪',
    '春香桑': '春香桑今天烤的餅乾超香的說～我明明說只吃一塊，結果吃了三塊還想再拿…でへへ～',
    '紬醬': '紬醬昨天說了一串我聽不懂的話…但她眼神超真摯的，我只好頻頻點頭！',
    '琴葉桑': '我又被琴葉桑叫去收書包了…但她幫我摺好角落還拍了拍我頭，嗚哇…有點像媽媽的感覺',
    '百合子': '百合子昨天又在幻想她是魔法師，我被她拉去演反派了啦～',
    '歌織桑': '我偷懶的時候，歌織桑會像陽光一樣對我說加油，聽了就突然好有精神喔♪',
    '美咲醬': '不管我問什麼，美咲醬都會說「交給我吧！」她是不是偷偷是魔法少女呀～？'
  };

  const tone = toneMap[emotion] || toneMap.default;
  const opening = starters[Math.floor(Math.random() * starters.length)];
  const mood = tone[Math.floor(Math.random() * tone.length)];
  const closing = suffixes[Math.floor(Math.random() * suffixes.length)];
  const relatedLine = relatedTone[related] || '';

  return `${opening} ${mood} 我剛剛在想：${topic}～${context ? ' ' + context : ''}${relatedLine ? '\n' + relatedLine : ''} ${closing}`;
}

