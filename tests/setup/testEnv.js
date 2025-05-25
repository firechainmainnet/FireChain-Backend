// tests/setup/testEnv.js
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
process.env.TZ = 'UTC';

global.testUid = `test_user_${Date.now()}_${uuidv4()}`;
global.generateTestUid = (prefix = 'test') => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

global.log = (...args) => console.log('[TEST]', ...args);

// ✅ exporta explicitamente
export const generateTestUid = global.generateTestUid;
