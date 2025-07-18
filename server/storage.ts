import { RedisStorage } from '../RedisStorage';
import { MockStorage } from '../MockStorage';

// Use MockStorage em desenvolvimento para evitar erros de Redis
export const storage = process.env.NODE_ENV === 'development' 
  ? new MockStorage()
  : new RedisStorage();
