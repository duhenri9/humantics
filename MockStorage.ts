// Mock Storage para desenvolvimento
export interface IStorage {
  healthCheck(): Promise<boolean>;
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, updates: Partial<any>): Promise<any>;
}

export class MockStorage implements IStorage {
  private data: Map<string, any> = new Map();
  private emailToId: Map<string, string> = new Map();

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.data.get(id);
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const id = this.emailToId.get(email);
    if (!id) return undefined;
    return this.data.get(id);
  }

  async createUser(user: any): Promise<any> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = { ...user, id, createdAt: new Date().toISOString() };
    this.data.set(id, userData);
    if (user.email) {
      this.emailToId.set(user.email, id);
    }
    return userData;
  }

  async updateUser(id: string, updates: Partial<any>): Promise<any> {
    const existing = this.data.get(id);
    if (!existing) {
      throw new Error('User not found');
    }
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.data.set(id, updated);
    return updated;
  }
}
