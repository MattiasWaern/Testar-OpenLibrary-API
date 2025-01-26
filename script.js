// Import the trendingBooks array
import trendingBooks from "./trendingBooks.js";

// Search functionality
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim();
    if (query) {
        searchBooks(query);
    } else {
        alert("Skriv in en boktitel eller författare!");
    }
});

document.getElementById("search-input").addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (!query) {
        // If the search input is empty, show the Trending Books section
        togglePopularBooks(true);
        document.getElementById("results").innerHTML = ""; // Clear search results
    }
});

async function searchBooks(query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=title,author_name,first_publish_year,cover_i,key`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Något gick fel med API-anropet.");
        }
        const data = await response.json();

        // Hide the Trending Books section
        togglePopularBooks(false);

        // Filtrera resultat för att matcha både titel och författare
        const filteredBooks = data.docs.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) || 
            (book.author_name && book.author_name.some(author => author.toLowerCase().includes(query.toLowerCase())))
        );

        displayResults(filteredBooks);
    } catch (error) {
        console.error("Fel vid API-anrop:", error);
        document.getElementById("results").innerHTML = "<p>Kunde inte hämta data. Försök igen senare.</p>";
    }
}

function displayResults(books) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Rensa tidigare resultat

    if (books.length === 0) {
        resultsContainer.innerHTML = "<p>Inga böcker eller författare hittades. Försök med en annan sökning.</p>";
        return;
    }

    books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        
        const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'https://via.placeholder.com/200x300.png?text=No+Cover';
        
        bookElement.innerHTML = `
            <img src="${coverUrl}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>Författare: ${book.author_name ? book.author_name.join(", ") : "Ej angiven"}</p>
            <p>Publiceringsår: ${book.first_publish_year || "Ej angivet"}</p>
            <p><a href="https://openlibrary.org${book.key}" target="_blank">Läs mer</a></p>
        `;
        
        resultsContainer.appendChild(bookElement);
    });
}

// Fetch and display trending books
function fetchPopularBooks() {
    displayPopularBooks(trendingBooks); // Use the imported trendingBooks array
}

function displayPopularBooks(books) {
    const popularResults = document.getElementById("popular-results");
    popularResults.innerHTML = "";

    books.slice(0, 6).forEach((book) => { // Show only 6 books
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");

        const coverUrl = book.coverUrl;
        const title = book.title;
        const author = book.author;
        const description = book.description;
        const shortDescription =
            description.length > 100
                ? description.substring(0, 100) + "..."
                : description;

        const stars = Math.floor(Math.random() * 5) + 1;
        const starRating = "⭐".repeat(stars);

        bookElement.innerHTML = `
            <img src="${coverUrl}" alt="${title}">
            <h2>${title}</h2>
            <p>Av ${author}</p>
            <p>${shortDescription}</p>
            <div class="stars">${starRating}</div>
        `;

        popularResults.appendChild(bookElement);
    });
}

// Toggle Trending Books section visibility
function togglePopularBooks(show) {
    const popularBooksSection = document.querySelector(".popular-books");
    if (show) {
        popularBooksSection.style.display = "block"; // Show the section
    } else {
        popularBooksSection.style.display = "none"; // Hide the section
    }
}

// Show Trending Books on page load
window.onload = function () {
    fetchPopularBooks();
    togglePopularBooks(true);
};