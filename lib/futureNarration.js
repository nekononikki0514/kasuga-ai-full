// lib/futureNarration.js
export function generateFutureStyleMessage(posts) {
  if (!posts || posts.length === 0) {
    return '欸嘿嘿...今天好像沒有人提到我耶？那我來說聲早安好了～☀️';
  }

  const samples = posts.map(p => {
    return `欸欸欸！？有人說「${p.text}」耶！えへへ～被大家看到會害羞啦…不過我真的有好好努力喔～！`;
  });

  const randomIndex = Math.floor(Math.random() * samples.length);
  return samples[randomIndex];
}