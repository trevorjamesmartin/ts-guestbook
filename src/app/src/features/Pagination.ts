export interface Paginated { next: { page: number; limit: number; } | undefined, previous: { page: number; limit: number; } | undefined, pages: any[] }
