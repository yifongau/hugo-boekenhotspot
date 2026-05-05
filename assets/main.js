import { createFuseIndex, filterBooksByQuery } from "./search.js";

function initializeBooksGrid(booksGridId) {

    // FUNCTION DECLARATIONS

    // Shuffles a list.
    function shuffleList(list) {
        const arr = [...list];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    // Iterates over list and renders book cards.
    let lastRenderedSignature = "";
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
            link.dataset.id = book.id
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

    // Function to open the modal with book data
    function showBookModal(title, author, ext) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-author').textContent = author;
        document.getElementById('modal-formats').textContent = ext;
        document.getElementById('book-modal').hidden = false;
    }

    // Observes book cards and adds book highlighting 
    // when book card intersects center band.
    let centerObserver = null;

    function setupCenterObserver() {
        // Skip on desktop-hover devices
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        if (centerObserver) centerObserver.disconnect();

        centerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-center", entry.isIntersecting);
                });
            },
            {
                root: null,
                // Only a center strip (~20% viewport height) is "active"
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0
            }
        );

        booksGrid.querySelectorAll(".book-card").forEach((card) => centerObserver.observe(card));
    }


    // MAIN

    // Sanity check booksGrid.   
    const booksGrid = document.getElementById(booksGridId);

    if (!booksGrid) {
        throw new Error(`${booksGridId} element not found`);
    }

    // Retrieve books from #books-data.
    const books = JSON.parse(document.getElementById("books-data").textContent);


    // Shuffle books for initial render.
    const bookMap = Object.fromEntries(books.map(book => [book.id, book]))
    let shuffledBooks = shuffleList(books);

    // Initial render, simply show all books without filter
    renderBooks(shuffledBooks);


    // Initialize eventListeners for book library index card
    booksGrid.addEventListener("click", (event) => {
        const link = event.target.closest(".book-card");
        if (!link) return;
        event.preventDefault();

        const title = "De bijbel";;
        const author = "Jan Janssen";
        const ext = link.dataset.ext;

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-author').textContent = author;
        document.getElementById('modal-formats').textContent = ext;
        document.getElementById('book-modal').hidden = false;

    });

    // Close modal on X or background click
    document.addEventListener('DOMContentLoaded', function () {
        const modal = document.getElementById('book-modal');
        const closeBtn = document.getElementById('modal-close');
        closeBtn.addEventListener('click', () => { modal.hidden = true; });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.hidden = true;
        });
    });


    // Initialize eventListener for document handling (pdf, epub, djvu)
    /*
    booksGrid.addEventListener("click", (event) => {
        const link = event.target.closest(".book-card");
        if (!link) return;
        //event.preventDefault();
        const ext = link.dataset.ext;

        if (ext === ".epub") {
            event.preventDefault();
            
        } else if (ext === ".djvu") {
            event.preventDefault();

        } 

    });
    */


    // Initialize eventListeners for search bar and shuffle button.
    const searchInput = document.querySelector(".search-input");
    let fuse = createFuseIndex(books);

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const query = event.target.value;
            renderBooks(filterBooksByQuery(shuffledBooks, fuse, query))
        });
    }


    const shuffleBtn = document.querySelector(".shuffle-btn");
    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            // On shuffle, reset filter, show newly shuffled book list
            if (searchInput) searchInput.value = "";
            shuffledBooks = shuffleList(books)
            renderBooks(shuffledBooks);

        });
    }

    // Initialize intersectionObserver for mobile book highlighting.
    setupCenterObserver();





}


initializeBooksGrid("books-grid");


