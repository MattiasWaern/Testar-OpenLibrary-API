import trendingBooks from "./trendingBooks.js";

// Google Books API key (replace with your own API key)
const API_KEY = "AIzaSyCWbp_rRX-T32jS0kVQZO7OnkcP-q4Lzfw";

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
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=10&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Något gick fel med API-anropet.");
    }
    const data = await response.json();

    // Hide the Trending Books section
    togglePopularBooks(false);

    // Extract and display results
    const books = data.items || [];
    displayResults(books);
  } catch (error) {
    console.error("Fel vid API-anrop:", error);
    document.getElementById("results").innerHTML =
      "<p>Kunde inte hämta data. Försök igen senare.</p>";
  }
}

function displayResults(books) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (books.length === 0) {
    resultsContainer.innerHTML =
      "<p>Inga böcker eller författare hittades. Försök med en annan sökning.</p>";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const volumeInfo = book.volumeInfo;
    const title = volumeInfo.title || "Ej angiven";
    const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Ej angiven";
    const publishYear = volumeInfo.publishedDate
      ? volumeInfo.publishedDate.split("-")[0]
      : "Ej angivet";
    const coverUrl = volumeInfo.imageLinks
      ? volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
      : "https://via.placeholder.com/200x300.png?text=No+Cover";

    bookElement.innerHTML = `
      <img src="${coverUrl}" alt="${title}">
      <h2>${title}</h2>
      <p>Författare: ${authors}</p>
      <p>Publiceringsår: ${publishYear}</p>
      <p><a href="${volumeInfo.previewLink}" target="_blank">Läs mer</a></p>
    `;

    // Add click event listener to navigate to book details page
    bookElement.addEventListener("click", () => {
      const bookId = book.id; // Use the Google Books ID
      window.location.href = `book-details.html?id=${bookId}`;
    });

    resultsContainer.appendChild(bookElement);
  });
}

function displayPopularBooks(books) {
  const popularResults = document.getElementById("popular-results");
  popularResults.innerHTML = "";

  books.slice(0, 6).forEach((book) => {
    // Show only 6 books
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

    // Add click event listener to navigate to book details page
    bookElement.addEventListener("click", () => {
      const bookId = book.id; // Assuming each book in trendingBooks has an 'id' property
      window.location.href = `book-details.html?id=${bookId}`;
    });

    popularResults.appendChild(bookElement);
  });
}

// Fetch and display trending books
function fetchPopularBooks() {
  displayPopularBooks(trendingBooks); // Use the imported trendingBooks array
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