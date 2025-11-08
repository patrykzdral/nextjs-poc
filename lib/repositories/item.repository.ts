import { db } from '@/lib/db';
import { items, Item, NewItem } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface ItemRepository {
  getAll(): Promise<Item[]>;
  getById(id: string): Promise<Item | undefined>;
  create(item: Omit<NewItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Item | undefined>;
}

class ItemRepositoryImpl implements ItemRepository {
  async getAll(): Promise<Item[]> {
    return db.select().from(items).orderBy(items.createdAt);
  }

  async getById(id: string): Promise<Item | undefined> {
    const result = await db.select().from(items).where(eq(items.id, id)).limit(1);
    return result[0];
  }

  async create(item: Omit<NewItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const result = await db
      .insert(items)
      .values({
        name: item.name,
        description: item.description,
      })
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(items).where(eq(items.id, id)).returning();
    return result.length > 0;
  }

  async findByName(name: string): Promise<Item | undefined> {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.name, name))
      .limit(1);
    return result[0];
  }
}

// Export singleton instance
export const itemRepository = new ItemRepositoryImpl();
