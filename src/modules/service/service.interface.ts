export interface IServiceQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;
    category?: string;
    technicianId?: string;
    minPrice?: number;
    maxPrice?: number;
    isBan?: boolean;
}