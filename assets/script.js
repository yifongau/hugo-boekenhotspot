function initializeBooksGrid(books, booksGridId) {
    const booksGrid = document.getElementById(booksGridId);

    if (!booksGrid) {
        throw new Error(`${booksGridId} element not found`);
    }

    // Signature for comparing qeury result with rendered result.
    let lastRenderedSignature = "";

    // Initialize book list in shuffled state.
    let shuffledBooks = shuffleList(books);

    // Iterate over list of books and populate the books grid
    function renderBooks(list) {

        // Check current state
        const nextSignature = list.map((book) => book.bookFilePath).join("\u001F");
        if (nextSignature === lastRenderedSignature) return; // nothing changed
        lastRenderedSignature = nextSignature;

        booksGrid.replaceChildren();
        list.forEach((book) => {

            // Construct link element
            const link = document.createElement("a");
            link.className = "book-card";
            link.href = book.bookFilePath;
            link.target = "_blank"; // Open in new tab
            link.rel = "noopener noreferrer"; // Security best practice

            // Construct image element
            const img = document.createElement("img");
            img.className = "book-cover";
            img.src = book.imageFilePath;
            img.alt = "Boekomslag"; // Alt text for accessibility 
            img.loading = "lazy"; // Lazy load images for better performance
            img.decoding = "async"; // Asynchronous decoding for better performance

            // Wrap <img> in <a> to make the entire image clickable.
            link.appendChild(img);

            const item = document.createElement("div");
            item.appendChild(link);
            booksGrid.appendChild(item);
        });


    }

    // Filter list of books
    function filterBooksByQuery(list, query) {
        if (!query) return list

        // Normalize: lowercase, trim, remove accents
        const normalizedQuery = query
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Don't filter on very short queries
        if (normalizedQuery.length < 3) return list;

        // AND search: every token must match somewhere in the book text
        const tokens = normalizedQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

        // Perform search
        return list.filter((book) =>
            tokens.every((token) => book.searchText.includes(token))
        );


    }

    // Shuffle books in-place on first load (Fisher-Yates)
    function shuffleList(list) {
        const arr = [...list];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Normalize book.searchText, as we can't do it in Hugo build.
    books.forEach((book) => {
        book.searchText = (book.searchText || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    });

    // Initial state: no query yet, so render all books
    renderBooks(filterBooksByQuery(shuffledBooks));


    // Each time search input changes, rerender books
    const searchInput = document.querySelector(".search-input");

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const query = event.target.value;
            renderBooks(filterBooksByQuery(shuffledBooks, query))
        });
    }

    // When clicking shuffle button, rerender randomnized book grid
    const shuffleBtn = document.querySelector(".shuffle-btn");
    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            shuffledBooks = shuffleList(books)
            renderBooks(shuffledBooks);
        });
    }







}

