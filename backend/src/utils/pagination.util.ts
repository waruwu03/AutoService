// src/utils/pagination.util.ts

import { PaginationQuery } from '../types/common.types';

export function parsePagination(query: PaginationQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';

  return { page, limit, skip, sortBy, sortOrder };
}

export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
