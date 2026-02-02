export type QueryObject = {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  //   [key: string]: string | undefined;
};

export type SearchQuery = {
  $or?: [{ title: FilterQuery }, { description: FilterQuery }];
  name?: FilterQuery;
};

export type FilterQuery = {
  $regex: string;
  $options: string;
};
