// Simple in-memory data store
// In production, replace this with a proper database

export interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Use globalThis to persist data across HMR in development
const globalForData = globalThis as unknown as {
  items: Item[] | undefined;
};

if (!globalForData.items) {
  globalForData.items = [
    {
      id: '1',
      name: 'Sample Item 1',
      description: 'This is a sample item from the backend',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sample Item 2',
      description: 'Another sample item',
      createdAt: new Date().toISOString(),
    },
  ];
}

const items = globalForData.items;

export const dataStore = {
  getAll: () => items,

  getById: (id: string) => items.find(item => item.id === id),

  create: (item: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: item.name,
      description: item.description,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    return newItem;
  },

  delete: (id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  },
};
