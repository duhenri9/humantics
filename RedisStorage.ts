import Redis from 'ioredis';

export interface IStorage {
  healthCheck(): Promise<boolean>;
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, updates: Partial<any>): Promise<any>;
  // ... outros métodos necessários para as 18 funcionalidades críticas
}

export class RedisStorage implements IStorage {
  private redis: Redis;

  constructor(redisUrl?: string) {
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://redis:6379');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  async getUser(id: string): Promise<any | undefined> {
    const data = await this.redis.get(`user:${id}`);
    return data ? JSON.parse(data) : undefined;
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const id = await this.redis.get(`user:email:${email}`);
    if (!id) return undefined;
    return this.getUser(id);
  }

  async createUser(user: any): Promise<any> {
    const id = user.id || String(Date.now());
    await this.redis.set(`user:${id}`, JSON.stringify(user));
    if (user.email) {
      await this.redis.set(`user:email:${user.email}`, id);
    }
    return { ...user, id };
  }

  async updateUser(id: string, updates: Partial<any>): Promise<any> {
    const user = await this.getUser(id);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...updates };
    await this.redis.set(`user:${id}`, JSON.stringify(updated));
    return updated;
  }

  // ...implementar métodos para pagamentos, suporte, MCP, etc.
}
