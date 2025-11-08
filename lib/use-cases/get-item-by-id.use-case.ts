import { itemRepository } from '@/lib/repositories/item.repository';
import { Item } from '@/lib/db/schema';
import { UseCase, Result, NotFoundError } from './types';

export interface GetItemByIdInput {
  id: string;
}

export interface GetItemByIdOutput {
  item: Item;
}

export class GetItemByIdUseCase implements UseCase<GetItemByIdInput, Promise<Result<GetItemByIdOutput>>> {
  async execute(input: GetItemByIdInput): Promise<Result<GetItemByIdOutput>> {
    try {
      // Business logic: Validate input
      if (!input.id || input.id.trim() === '') {
        throw new NotFoundError('Item ID is required');
      }

      const item = await itemRepository.getById(input.id);

      if (!item) {
        throw new NotFoundError(`Item with ID ${input.id} not found`);
      }

      // You can add additional business logic here, such as:
      // - Checking user permissions
      // - Logging access
      // - Incrementing view count, etc.

      return {
        success: true,
        data: { item },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }
}
