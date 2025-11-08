import { itemRepository } from '@/lib/repositories/item.repository';
import { Item } from '@/lib/db/schema';
import { UseCase, Result, ValidationError, BusinessRuleError } from './types';

export interface CreateItemInput {
  name: string;
  description: string;
}

export interface CreateItemOutput {
  item: Item;
}

export class CreateItemUseCase implements UseCase<CreateItemInput, Promise<Result<CreateItemOutput>>> {
  async execute(input: CreateItemInput): Promise<Result<CreateItemOutput>> {
    try {
      // Business logic: Validate input
      this.validateInput(input);

      // Business logic: Check business rules
      await this.checkBusinessRules(input);

      // Create the item
      const item = await itemRepository.create({
        name: input.name.trim(),
        description: input.description.trim(),
      });

      // You can add additional business logic here, such as:
      // - Sending notifications
      // - Triggering events
      // - Creating audit logs, etc.

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

  private validateInput(input: CreateItemInput): void {
    if (!input.name || input.name.trim() === '') {
      throw new ValidationError('Name is required');
    }

    if (!input.description || input.description.trim() === '') {
      throw new ValidationError('Description is required');
    }

    // Business logic: Name length validation
    if (input.name.trim().length < 3) {
      throw new ValidationError('Name must be at least 3 characters long');
    }

    if (input.name.trim().length > 100) {
      throw new ValidationError('Name must not exceed 100 characters');
    }

    // Business logic: Description length validation
    if (input.description.trim().length < 10) {
      throw new ValidationError('Description must be at least 10 characters long');
    }

    if (input.description.trim().length > 500) {
      throw new ValidationError('Description must not exceed 500 characters');
    }
  }

  private async checkBusinessRules(input: CreateItemInput): Promise<void> {
    // Business logic: Check for duplicate names
    const existingItem = await itemRepository.findByName(input.name.trim());

    if (existingItem) {
      throw new BusinessRuleError('An item with this name already exists');
    }

    // You can add more business rules here, such as:
    // - Maximum number of items allowed
    // - Content filtering for inappropriate words
    // - Rate limiting per user, etc.
  }
}
