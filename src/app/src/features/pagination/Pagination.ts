export interface SlicedPages {
  page: number;
  limit: number;
};

export interface Paginated { 
  next: SlicedPages | undefined,
  previous: SlicedPages | undefined,
  pages: any[]
}

