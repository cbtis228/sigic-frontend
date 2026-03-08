export interface PaginatedData<ItemType = unknown> {
  results: ItemType[];
  rows: ItemType[];
  count: number;
  limit: number;
  offset: number;
  next: string;
  previous: string;
}
