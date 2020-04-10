document.addEventListener("DOMContentLoaded", () => {
  const card_container = document.getElementsByClassName("card-container");
  const auto_scroll_resumer = document.getElementsByClassName("auto-scroll-resumer");
  const scroll_offset = new Array(card_container.length).fill(0);
  const is_auto_scrolling = new Array(card_container.length).fill(true);
  const distance = new Array(card_container.length).fill(1);
  const time = new Array(card_container.length).fill(33);
  let timer = [];

  for (let i = 0; i < card_container.length; i++) {
    card_container[i].addEventListener("mouseover", () => is_auto_scrolling[i] = false, {passive: true});
    card_container[i].addEventListener("touchend", () => is_auto_scrolling[i] = false, {passive: true});
  }

  for (let i = 0; i < card_container.length; i++) {
    auto_scroll_resumer[i].addEventListener("click", () => {
      if (!is_auto_scrolling[i]) {
        is_auto_scrolling[i] = true;
        scroll_offset[i] = card_container[i].scrollLeft;
      }
    }, {passive: true});
    auto_scroll_resumer[i].addEventListener("touchstart", () => {
      if (!is_auto_scrolling[i]) {
        is_auto_scrolling[i] = true;
        scroll_offset[i] = card_container[i].scrollLeft;
      }
    }, {passive: true});
  }

  function auto_scroller() {
    for (let i = 0; i < card_container.length; i++) {
      timer[i] = setInterval(() => {
        if (is_auto_scrolling[i] && card_container[i].scrollWidth > card_container[i].clientWidth) {
          card_container[i].scrollTo({ left: scroll_offset[i] += distance[i], behavior: 'smooth' });
          if (card_container[i].scrollLeft >= card_container[i].scrollWidth - card_container[i].clientWidth || card_container[0].scrollLeft <= 0) {
            switch (card_container[i].scrollLeft) {
              case 0:
                distance[i] = 1;
                time[i] = 33;
                break;
              default:
                distance[i] = -50;
                time[i] = 5;
                break;
            }
            card_container[i].scrollTo({ left: scroll_offset[i] += distance[i], behavior: 'smooth' });
          }
        }
      }, time[i]);
    }
  }

  auto_scroller();
}, {passive: true});