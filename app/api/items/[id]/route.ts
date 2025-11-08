import { NextRequest, NextResponse } from 'next/server';
import {
  GetItemByIdUseCase,
  DeleteItemUseCase,
  NotFoundError,
  BusinessRuleError,
} from '@/lib/use-cases';

// DELETE /api/items/[id] - Delete an item by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const useCase = new DeleteItemUseCase();
  const result = await useCase.execute({ id });

  if (!result.success) {
    const error = result.error;

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof BusinessRuleError) {
      return NextResponse.json(
        { error: error.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data);
}

// GET /api/items/[id] - Get a single item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const useCase = new GetItemByIdUseCase();
  const result = await useCase.execute({ id });

  if (!result.success) {
    const error = result.error;

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data);
}
