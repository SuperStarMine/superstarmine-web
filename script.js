const card_container = document.getElementsByClassName("card-container");
let scroll_offset = [0, 0];
let auto_scroll = [true, true];

for (let i = 0; i < card_container.length; i++) {
  card_container[i].onmouseover = () => auto_scroll[i] = false;
  card_container[i].ontouchstart = () => auto_scroll[i] = false;
}

if (auto_scroll) {
  let timer = setInterval(() => {
    for (let i = 0; i < card_container.length; i++) {
      if (auto_scroll[i]) {
        let before_scroll = card_container[i].scrollLeft;
        scroll_offset[i] += 1
        card_container[i].scrollTo({ left: scroll_offset[i], behavior: 'smooth' });
        console.log(scroll_offset);
      }
    }
  }, 100);
}