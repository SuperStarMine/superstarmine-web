function materializeElements(ghosts) {
  const done = new Array(ghosts.length).fill(false);
  for (let i = 0; i < ghosts.length; i++) {
    if (ghosts[i].getBoundingClientRect().y - innerHeight < 200 && !done[i]) {
      const element = document.createElement("iframe");
      const data = JSON.parse(ghosts[i].dataset.iframe.replaceAll("'", '"').replaceAll("\n", "").replaceAll(" ", "").replaceAll("\t", ""));
      const keys = Object.keys(data);
      const values = Object.values(data);
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] == "class") {
          element.classList.add(values[j]);
        } else if (keys[j] == "allowfullscreen" && values[j]) {
          element.setAttribute("allowfullscreen", "");
        } else {
          element.setAttribute(keys[j], values[j]);
        }
      }
      element.textContent = ghosts[i].textContent;
      element.addEventListener('load', () => element.classList.add("isLoaded"));
      ghosts[i].insertAdjacentElement("beforebegin", element);
      ghosts[i].remove();
      done[i] = true;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ghosts = document.querySelectorAll("[data-iframe]");
  materializeElements(ghosts);
  addEventListener("scroll", () => materializeElements(ghosts));
});
