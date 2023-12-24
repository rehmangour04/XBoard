/** @format */

// getRSSFeedFromURL , Implements method to get rss feed from given url in json format
async function getRSSFeedFromURL(url) {
  try {
    const apiKey = "n2txanxeufpxp3vikhzeje1dqpx6vcrmfbrehk83";
    const count = 15 + Math.floor(Math.random() * 16);
    const conversionToJSONUrl = `https://api.rss2json.com/v1/api.json?api_key=${apiKey}&order_by=pubDate&count=${count}&rss_url=${url}`;
    const response = await fetch(conversionToJSONUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed (${response.status})`);
    }

    const feed = await response.json();
    return feed;
  } catch (error) {
    console.error("Error in getRSSFeedFromURL:", error);
    throw error; // Re-throw the error to propagate it further
  }
}

// addRSSFeedToDOM()
// function addRSSFeedToDOM(feed) , Implements a method to add given rss feed as input , to the dom container as
// bootstrap5

async function addRSSFeedToDOM(magazines) {
  // to get the container for all the accordions inner element with id ='rssfeed'

  const feedBox = document.getElementById("rssfeed");

  for (let i = 0; i < magazines.length; i++) {
    const data = await getRSSFeedFromURL(magazines[i]);
    const rank = i;
    const titleOfAccordion = data.feed.title;
    const showOnDOMContentLoaded = i === 0 ? "show" : "";

    const accordionElement = createAccordionElement(
      rank,
      titleOfAccordion,
      showOnDOMContentLoaded
    );
    feedBox.append(accordionElement);

    const accordionArticlesBox = document.getElementById(
      `accordionBody${rank}`
    );
    addArticlesToAccordion(data.items, accordionArticlesBox, rank);
  }
}

function createAccordionElement(rank, title, showClass) {
  const accordionElement = document.createElement("div");
  accordionElement.setAttribute("class", "accordion-item");
  accordionElement.innerHTML = `
    <h2 class="accordion-header" id="accordionHeading${rank}">
      <button class="accordion-button text-muted" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${rank}" aria-expanded="true" aria-controls="collapse${rank}">
        ${title}
      </button>
    </h2>
    <div id="collapse${rank}" class="accordion-collapse collapse ${showClass}" aria-labelledby="accordionHeading${rank}" >
      <div class="accordion-body" id="accordionBody${rank}">
      </div>
    </div>
  `;
  return accordionElement;
}

// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}

// Event listener for dark mode toggle button
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("change", toggleDarkMode);

// addArticlesToAccordion(article) , Implements a method to add given article as input , to the dom container as carousel
// add articles as a carousel

function addArticlesToAccordion(articles, feedBox, rank) {
  // data is an array of article
  // create a carousel of articles

  const carouselBox = document.createElement("div");
  carouselBox.id = "carousel" + rank;
  carouselBox.setAttribute("class", "carousel slide");
  carouselBox.setAttribute("data-bs-ride", "carousel");
  carouselBox.innerHTML = `
    <div class="carousel-inner" id="inner-carousel${rank}">
    
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel${rank}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel${rank}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;

  // add carousel Box to feed Box
  feedBox.append(carouselBox);

  const innerCarouselBox = document.getElementById(`inner-carousel${rank}`);

  for (let i = 0; i < articles.length; i++) {
    // get each item of carousel as a separate article , articles should be rendered as a card

    const article = articles[i];
    const d = new Date(article.pubDate);
    const date = d.toLocaleDateString("en-IN");
    const time = d.toLocaleTimeString("en-In");

    const articleBox = document.createElement("div");
    articleBox.setAttribute(
      "class",
      i === 0 ? "card carousel-item active" : "card carousel-item"
    );

    articleBox.innerHTML = `
      <a href="${article.link}" target="_blank">
        <img src="${article.enclosure.link}" class="d-block w-100 card-img-top" alt="${article.title}">
        
        <div class="card-body">
          <h4 class="card-title">${article.title}</h4>
          <h6 class="card-text text-muted" style="font-style:italic;">${article.author}  <button id="point"></button> ${date} ${time}</h6>
          <h6 class="card-subtitle mb-2 text-muted">${article.description}</h6>
        </div>
      </a>
    `;

    innerCarouselBox.append(articleBox);
  }
}

// Assuming magazines is defined somewhere before calling addRSSFeedToDOM
addRSSFeedToDOM(magazines);
