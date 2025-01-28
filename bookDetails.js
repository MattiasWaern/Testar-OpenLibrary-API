// bookDetails.js

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (bookId) {
        fetchBookDetails(bookId);
    } else {
        document.getElementById("book-details").innerHTML =
            "<p>Book not found.</p>";
    }
});

async function fetchBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Något gick fel med API-anropet.");
        }
        const data = await response.json();

        displayBookDetails(data);
    } catch (error) {
        console.error("Fel vid API-anrop:", error);
        document.getElementById("book-details").innerHTML =
            "<p>Kunde inte hämta data. Försök igen senare.</p>";
    }
}

function displayBookDetails(bookData) {
    const bookDetailsContainer = document.getElementById("book-details");

    // Extract fields and provide fallbacks
    const title = bookData.volumeInfo.title || "Ej angiven";
    const authors = bookData.volumeInfo.authors
        ? bookData.volumeInfo.authors.join(", ")
        : "Ej angiven";
    const description =
        bookData.volumeInfo.description || "Ingen beskrivning tillgänglig.";
    const publishYear = bookData.volumeInfo.publishedDate
        ? bookData.volumeInfo.publishedDate.split("-")[0]
        : "Ej angivet";
    const pages = bookData.volumeInfo.pageCount || "Ej angivet";
    const genres =
        bookData.volumeInfo.categories
            ? bookData.volumeInfo.categories.join(", ")
            : "Ej angivet";

    // Use a placeholder for missing covers
    const coverUrl = bookData.volumeInfo.imageLinks
        ? bookData.volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/200x300.png?text=No+Cover";

    // Update HTML
    bookDetailsContainer.innerHTML = `
        <div class="book-detail">
            <img src="${coverUrl}" alt="${title}" class="book-cover">
            <h2>${title}</h2>
            <p><strong>Författare:</strong> ${authors}</p>
            <p><strong>Publiceringsår:</strong> ${publishYear}</p>
            <p><strong>Sidor:</strong> ${pages}</p>
            <p><strong>Genrer:</strong> ${genres}</p>
            <p><strong>Beskrivning:</strong> ${description}</p>
        </div>
    `;
}
