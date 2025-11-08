import { itemRepository } from '@/lib/repositories/item.repository';
import { Item } from '@/lib/db/schema';
import { UseCase, Result, NotFoundError, BusinessRuleError } from './types';

export interface DeleteItemInput {
  id: string;
}

export interface DeleteItemOutput {
  message: string;
  deletedId: string;
}

export class DeleteItemUseCase implements UseCase<DeleteItemInput, Promise<Result<DeleteItemOutput>>> {
  async execute(input: DeleteItemInput): Promise<Result<DeleteItemOutput>> {
    try {
      // Business logic: Validate input
      if (!input.id || input.id.trim() === '') {
        throw new NotFoundError('Item ID is required');
      }

      // Business logic: Check if item exists and get it for business rules
      const item = await itemRepository.getById(input.id);
      if (!item) {
        throw new NotFoundError(`Item with ID ${input.id} not found`);
      }

      // Business logic: Check if deletion is allowed
      this.checkDeletionRules(input.id, item);

      // Perform deletion
      const deleted = await itemRepository.delete(input.id);

      if (!deleted) {
        // This shouldn't happen since we already checked above, but handle it anyway
        throw new NotFoundError(`Failed to delete item with ID ${input.id}`);
      }

      // You can add additional business logic here, such as:
      // - Sending notifications about deletion
      // - Creating audit logs
      // - Cleaning up related resources
      // - Triggering cascade deletions, etc.

      return {
        success: true,
        data: {
          message: 'Item deleted successfully',
          deletedId: input.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  private checkDeletionRules(id: string, item: Item): void {
    // Example business rule: Cannot delete items created in the last 5 minutes
    // (You can remove or modify this rule based on your needs)
    const createdAt = new Date(item.createdAt);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Commenting out this rule for now, but you can enable it if needed
    // if (createdAt > fiveMinutesAgo) {
    //   throw new BusinessRuleError('Cannot delete items created in the last 5 minutes');
    // }

    // You can add more business rules here, such as:
    // - Checking if user has permission to delete
    // - Preventing deletion of items with certain statuses
    // - Requiring additional confirmation for certain items, etc.
  }
}
