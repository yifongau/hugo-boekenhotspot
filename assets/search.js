import Fuse from "fuse.js";

export function createFuseIndex(books) {
    
    const options = {
        keys: [
            "metadata.metadata.title",
            "metadata.metadata.creator"
        ],
        threshold: 0.4, // adjust for fuzziness (lower = stricter)
        ignoreLocation: true,
        minMatchCharLength: 2,
    };
    return new Fuse(books,options);
}

export function filterBooksByQuery(list, fuse, query) {
     if (!fuse || !query || query.trim().length < 3) return list;
    return fuse.search(query).map(result => result.item);
}