import { NextRequest, NextResponse } from 'next/server';
import {
  GetAllItemsUseCase,
  CreateItemUseCase,
  ValidationError,
  BusinessRuleError,
} from '@/lib/use-cases';

// GET /api/items - Get all items
export async function GET(request: NextRequest) {
  const useCase = new GetAllItemsUseCase();

  // Get query parameters for sorting
  const searchParams = request.nextUrl.searchParams;
  const sortBy = searchParams.get('sortBy') as 'name' | 'createdAt' | null;
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;

  const result = await useCase.execute({
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data);
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const useCase = new CreateItemUseCase();
    const result = await useCase.execute({ name, description });

    if (!result.success) {
      const error = result.error;

      if (error instanceof ValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
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

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
