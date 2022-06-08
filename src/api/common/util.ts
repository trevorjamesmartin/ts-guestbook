import { DecodedToken, Paginated, ModelOptions } from './types';

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



export async function getPage(decodedToken: DecodedToken, model: any, options: ModelOptions) {
    let ordered;
    switch (options.sortOrder) {
        case "asc":
            ordered = ascending;
            break;
        case "desc":
        default:
            ordered = descending;
            break;
    }
    // TODO: define a standard model to include variable options.
    // these options will specify
    // + sort order
    // + range
    // + ...
    let results = (await model(decodedToken)).sort(ordered);
    let page = Number(options.page) || 1;
    let limit = Number(options.limit) || 4;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;

    const paginated: Paginated = {
        next: undefined,
        previous: undefined,
        pages: [],
        total: Math.ceil(results.length / limit)
    };

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
    return paginated
}

export function paginate(model: any, order?: "asc" | "desc") {
    return async (req: any, res: any, next: any) => {
        let { decodedToken } = req;
        let results: any;
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 4;
        const sortOrder = order || "desc";
        results = await getPage(decodedToken, model, {
            page, limit, sortOrder
        });
        req.paginatedResult = results
        next();
    }
}
