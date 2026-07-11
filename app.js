async function loadData() {
  const response = await fetch("./data/samples.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load sample data");
  }
  return response.json();
}

async function renderModelFigure() {
  const frame = document.getElementById("model-frame");
  const loading = document.getElementById("model-loading");

  if (!frame || !loading) {
    return;
  }

  try {
    const pdfjsLib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";

    const pdf = await pdfjsLib.getDocument("model.pdf").promise;
    frame.innerHTML = "";

    const renderPage = async (pageNumber) => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const availableWidth = frame.clientWidth - 24;
      const scale = availableWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      canvas.width = Math.floor(scaledViewport.width);
      canvas.height = Math.floor(scaledViewport.height);

      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;

      frame.appendChild(canvas);
    };

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      await renderPage(pageNumber);
    }
  } catch (error) {
    loading.innerHTML = `The model overview is available as <a href="model.pdf">model.pdf</a>.`;
    console.error("Failed to render model.pdf", error);
  }
}

function buildFilter(categories, selectEl) {
  selectEl.innerHTML = "";
  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "全部";
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
    card.classList.add("sample-card");

    card.querySelector(".sample-id").textContent = sample.id;
    card.querySelector(".sample-meta").textContent = sample.category;
    card.querySelector(".sample-transcription").textContent = sample.transcription;
    card.querySelector(".sample-caption").textContent = sample.caption;

    const tracks = card.querySelector(".tracks");
    sample.tracks.forEach((track) => {
      const row = trackTpl.content.firstElementChild.cloneNode(true);
      row.querySelector(".track-name").textContent = track.name;
      row.querySelector(".track-tag").textContent = track.name === "Prompt" ? "Text" : "Audio";
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

  renderModelFigure();

  try {
    const data = await loadData();
    const categories = [...new Set(data.samples.map((sample) => sample.category))].sort();
    buildFilter(categories, filterEl);

    const doRender = () => {
      const selected = filterEl.value;
      const view = selected === "all" ? data.samples : data.samples.filter((sample) => sample.category === selected);
      renderCards(view, cardsEl, cardTpl, trackTpl);
    };

    filterEl.addEventListener("change", doRender);
    doRender();
  } catch (error) {
    cardsEl.innerHTML = `<p>Unable to load demo data. ${error.message}</p>`;
  }
}

init();
