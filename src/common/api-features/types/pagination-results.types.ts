export type PaginationResult = {
  currentPage: number;
  itemsPerPage: number;
  numberOfPages: number;
  nextPage?: number;
  prevPage?: number;
};

export type GetAllResults<T> = {
  results: number;
  paginationResult: PaginationResult;
  data: T[];
};
