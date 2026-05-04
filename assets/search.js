function normalizeText(text) {
    return (text || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeSearchText(books) {
    console.log(books)
    books.forEach((book) => {
        book.searchText = normalizeText(book.searchText);
    });
}

export function filterBooksByQuery(list, query) {
    if (!query) return list;

    const normalizedQuery = normalizeText(query);
    if (normalizedQuery.length < 3) return list;

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return list.filter((book) =>
        tokens.every((token) => book.searchText.includes(token))
    );
}

