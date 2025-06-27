import fs from 'fs';
import path from 'path';

const memoryDir = path.resolve(process.cwd(), 'memory');

export function loadMemory(userId) {
  const filePath = path.join(memoryDir, userId + '.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      user_name: null,
      user_role: '',
      favorites: [],
      events: [],
      interaction_count: 0,
    };
  }
}

export function saveMemory(userId, memory) {
  const filePath = path.join(memoryDir, userId + '.json');
  fs.writeFileSync(filePath, JSON.stringify(memory, null, 2));
}
