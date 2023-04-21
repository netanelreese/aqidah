// Sample data
const texts = [
    {
      id: 1,
      title: "The Quran",
      author: "Allah",
      date: "609 CE - 632 CE",
      description: "The central religious text of Islam, which Muslims believe to be a revelation from God.",
      url: "https://en.wikipedia.org/wiki/Quran"
    },
    {
      id: 2,
      title: "Sahih Bukhari",
      author: "Muhammad al-Bukhari",
      date: "870 CE - 870 CE",
      description: "One of the Kutub al-Sittah (six major hadith collections) in Sunni Islam.",
      url: "https://en.wikipedia.org/wiki/Sahih_al-Bukhari"
    },
    {
      id: 3,
      title: "Sahih Muslim",
      author: "Muslim ibn al-Hajjaj",
      date: "870 CE - 875 CE",
      description: "One of the Kutub al-Sittah (six major hadith collections) in Sunni Islam.",
      url: "https://en.wikipedia.org/wiki/Sahih_Muslim"
    }
  ];
  
  // Select elements from the DOM
  const textList = document.querySelector("#text-list");
  
  // Render the text list
  function renderTextList(texts) {
    textList.innerHTML = "";
    for (const text of texts) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${text.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${text.author}</h6>
            <p class="card-text">${text.description}</p>
            <a href="${text.url}" target="_blank" class="card-link">Learn more</a>
          </div>
        </div>
      `;
      textList.appendChild(listItem);
    }
  }
  
  // Initialize the app
  function init() {
    renderTextList(texts);
  }
  
  // Call the init function when the DOM is loaded
  document.addEventListener("DOMContentLoaded", init);
  