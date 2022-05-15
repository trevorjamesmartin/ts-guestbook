export function timestamp() {
    let [d, t] = (new Date()).toISOString().split('T')
    return `${d} ${t.split('.')[0]}`;
}

function ascending(y: any, x: any) {
    return y.id - x.id
}

function descending(y: any, x: any) {
    return x.id - y.id
}

export interface Paginated { next: { page: number; limit: number; } | undefined, previous: { page: number; limit: number; } | undefined, pages: any[] }

export function paginate(model: any, sortFunction?: any) {
    return async (req: any, res: any, next: any) => {
        let { decodedToken } = req;
        let results: any;
        if (sortFunction) {
            results = (await model(decodedToken)).sort(sortFunction);
        } else {
            results = (await model(decodedToken)).sort(descending);
        }
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 5;
        const startIndex: number = (page - 1) * limit;
        const endIndex: number = page * limit;
        const paginated: Paginated = { next: undefined, previous: undefined, pages: [] };
        if (endIndex < results.length) {
            paginated.next = {
                page: page + 1,
                limit: limit,
            }
        }
        if (startIndex > 0) {
            paginated.previous = {
                page: page - 1,
                limit: limit,
            }
        }
        paginated.pages = results.slice(startIndex, endIndex);
        req.paginatedResult = paginated;
        next();
    }
}
