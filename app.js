async function loadData() {
  const response = await fetch("./data/samples.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load sample data");
  }
  return response.json();
}

function buildFilter(categories, selectEl) {
  selectEl.innerHTML = "";
  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "All";
  selectEl.appendChild(all);

  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    selectEl.appendChild(opt);
  });
}

function renderCards(samples, cardsEl, cardTpl, trackTpl) {
  cardsEl.innerHTML = "";

  if (!samples.length) {
    const empty = document.createElement("p");
    empty.textContent = "No samples for this category.";
    cardsEl.appendChild(empty);
    return;
  }

  samples.forEach((sample, index) => {
    const card = cardTpl.content.firstElementChild.cloneNode(true);
    card.style.animationDelay = `${index * 50}ms`;

    card.querySelector(".sample-id").textContent = sample.id;
    card.querySelector(".sample-meta").textContent = `Category: ${sample.category}`;
    card.querySelector(".text").textContent = sample.text;

    const tracks = card.querySelector(".tracks");
    sample.tracks.forEach((track) => {
      const row = trackTpl.content.firstElementChild.cloneNode(true);
      row.querySelector(".track-name").textContent = track.name;
      row.querySelector(".track-tag").textContent = track.tag || "";
      row.querySelector(".track-player").src = track.path;
      tracks.appendChild(row);
    });

    cardsEl.appendChild(card);
  });
}

async function init() {
  const cardsEl = document.getElementById("cards");
  const filterEl = document.getElementById("categoryFilter");
  const cardTpl = document.getElementById("card-template");
  const trackTpl = document.getElementById("track-template");

  try {
    const data = await loadData();
    const categories = [...new Set(data.samples.map((s) => s.category))].sort();
    buildFilter(categories, filterEl);

    const doRender = () => {
      const selected = filterEl.value;
      const view = selected === "all" ? data.samples : data.samples.filter((s) => s.category === selected);
      renderCards(view, cardsEl, cardTpl, trackTpl);
    };

    filterEl.addEventListener("change", doRender);
    doRender();
  } catch (error) {
    cardsEl.innerHTML = `<p>Unable to load demo data. ${error.message}</p>`;
  }
}

init();
