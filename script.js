document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim();
    if (query) {
      searchBooks(query);
    } else {
      alert("Skriv in en boktitel eller författare!");
    }
  });
  
  async function searchBooks(query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,author_name,first_publish_year,cover_i`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Något gick fel med API-anropet.");
      }
      const data = await response.json();
  
      // Visa endast böcker som matchar exakt titel
      const filteredBooks = data.docs.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase())
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
      resultsContainer.innerHTML = "<p>Inga böcker hittades. Försök med en annan sökning.</p>";
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