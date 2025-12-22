// ✅ src/types/pagination.ts
export interface PaginatedResponse<T> {
  content: T[];
  size: number;
  page:number;
  totalElements: number;
  totalPages: number;
  last:boolean
}
