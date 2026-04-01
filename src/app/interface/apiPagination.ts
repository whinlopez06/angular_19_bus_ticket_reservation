export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: [],
    path: string | null;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationLinks {
    first: string | null,
    last: string | null,
    next: string | null,
    prev: string | null
}

export interface ApiPagination<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
