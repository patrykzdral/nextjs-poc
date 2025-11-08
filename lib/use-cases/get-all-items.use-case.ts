import { itemRepository } from '@/lib/repositories/item.repository';
import { Item } from '@/lib/db/schema';
import { UseCase, Result } from './types';

export interface GetAllItemsInput {
  // You can add filtering/sorting parameters here
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetAllItemsOutput {
  items: Item[];
  count: number;
}

export class GetAllItemsUseCase implements UseCase<GetAllItemsInput, Promise<Result<GetAllItemsOutput>>> {
  async execute(input: GetAllItemsInput = {}): Promise<Result<GetAllItemsOutput>> {
    try {
      let items = await itemRepository.getAll();

      // Business logic: Apply sorting if specified
      if (input.sortBy) {
        items = this.sortItems(items, input.sortBy, input.sortOrder || 'asc');
      }

      return {
        success: true,
        data: {
          items,
          count: items.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  private sortItems(items: Item[], sortBy: 'name' | 'createdAt', sortOrder: 'asc' | 'desc'): Item[] {
    const sorted = [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }
}
