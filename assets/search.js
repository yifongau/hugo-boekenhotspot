import Fuse from "fuse.js";

export function createFuseIndex(books) {
    
    const options = {
        keys: [
            "rawMetadata.metadata.title",
            "rawMetadata.metadata.creator.#text"
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