document.addEventListener("DOMContentLoaded", () => {
  const card_container = document.getElementsByClassName("card-container"),
        auto_scroll_resumer = document.getElementsByClassName("auto-scroll-resumer"),
        scroll_offset = new Array(card_container.length).fill(0),
        is_paused = new Array(card_container.length).fill(false),
        is_waiting = new Array(card_container.length).fill(false),
        is_rewinding = new Array(card_container.length).fill(false),
        rewind_duration = 500,
        rewind_start_time = [],
        max_scroll = [],
        speed_value = 30, //px/s
        speed = new Array(card_container.length).fill(speed_value);
  let last_time,
      timeout = [];

  for (let i = 0; i < card_container.length; i++) {
    card_container[i].addEventListener(window.ontouchstart ? "touchend" : "mouseover", () => is_paused[i] = true, { passive: true });
  }

  for (let i = 0; i < card_container.length; i++) {
    auto_scroll_resumer[i].addEventListener(window.ontouchstart ? "touchstart" : "click", () => is_paused[i] = false, {passive: true});
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function auto_scroller(time) {
    if (!last_time) {
      last_time = time;
      requestAnimationFrame(auto_scroller);
      return;
    }
    for (let i = 0; i < card_container.length; i++) {
      if (!is_waiting[i] && !is_paused[i] && card_container[i].scrollWidth > card_container[i].clientWidth) {
        if (is_rewinding[i]) {
          if (!rewind_start_time[i]) rewind_start_time[i] = time;
          if (!max_scroll[i]) max_scroll[i] = scroll_offset[i];
          scroll_offset[i] = max_scroll[i] * (1 - easeInOutCubic((time - rewind_start_time[i]) / rewind_duration));
          if (card_container[i].scrollLeft <= 0) {
            is_rewinding[i] = false;
            rewind_start_time[i] = null;
            max_scroll[i] = null;
            is_waiting[i] = true;
            timeout[i] = setTimeout(() => is_waiting[i] = false, 1000);
          }
        }
        if (card_container[i].scrollLeft >= card_container[i].scrollWidth - card_container[i].clientWidth && !is_rewinding[i]) {
          is_rewinding[i] = true;
          is_waiting[i] = true;
          timeout[i] = setTimeout(() => is_waiting[i] = false, 500);
        } else {
          card_container[i].scrollTo({ left: scroll_offset[i] += (time - last_time) / 1e3 * speed[i], behavior: 'smooth' });
        }
      }
    }
    requestAnimationFrame(auto_scroller);
    last_time = time;
  }

  requestAnimationFrame(auto_scroller);
}, {passive: true});