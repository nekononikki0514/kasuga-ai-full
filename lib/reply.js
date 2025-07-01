// lib/reply.js

import {
  generateDailyUpdate,
  classifyTopicFromInput,
  enrichWithMemory
} from "@/lib/kasugaDaily";

export async function reply({
  role = "未来",
  user,
  topic,
  emotion = "default",
  context = "",
  related = [],
  text = ""
}) {
  const detectedTopic = classifyTopicFromInput(context || text);
  const memory = await enrichWithMemory({ userId: user?.id, topic: detectedTopic });

  const daily = generateDailyUpdate({
    topic: detectedTopic,
    preferredCharacter: memory.preferredCharacter
  });

  return `${user?.name || "製作人"}～ ${daily}`;
}
