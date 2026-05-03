function renderBooksGrid(books, booksGridId) {
    const booksGrid = document.getElementById(booksGridId);

    if (!booksGrid) {
        throw new Error(`${booksGridId} element not found`);
    }

    // Iterate over books and populate the books grid
    books.forEach((book) => {

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

    console.log("Book files:", books);

}

