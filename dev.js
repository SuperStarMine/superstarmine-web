addEventListener('load', () => {
  const i = document.getElementsByClassName('sl');
  const d = document.getElementsByClassName('label');
  const b = document.getElementsByClassName('blend');
  const color = [128, 128, 128, 0.5];
  const board = document.getElementById('hero_background-blur');
  const rangeValue = (elem, target, index, board) => {
    return () => {
      target.textContent = elem.value;
      if (index == 0) {
        color[0] = elem.value;
        color[1] = elem.value;
        color[2] = elem.value;
        board.style.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        target.style.color = `rgb(${elem.value},${elem.value},${elem.value})`;
        d[1].style.color = `rgb(${elem.value},0,0)`;
        d[1].textContent = elem.value;
        i[1].value = elem.value;
        d[2].style.color = `rgb(0,${elem.value},0)`;
        d[2].textContent = elem.value;
        i[2].value = elem.value;
        d[3].style.color = `rgb(0,0,${elem.value})`;
        d[3].textContent = elem.value;
        i[3].value = elem.value;
      }else if (index == 5) {
        board.style.setProperty('-webkit-backdrop-filter', `blur(${elem.value}px)`);
        board.style.setProperty('-moz-backdrop-filter', `blur(${elem.value}px)`);
        board.style.setProperty('backdrop-filter', `blur(${elem.value}px)`);
      } else {
        color[index-1] = elem.value;
        board.style.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        target.style.color = `rgb(${index==1?elem.value:0},${index==2?elem.value:0},${index==3?elem.value:0})`
      }
    }
  }
  const button = (elem, board) => {
    return () => {
      board.style.setProperty('mix-blend-mode', elem.textContent);
    }
  }
  for (let l = 0; l < b.length; l++) {
    b[l].addEventListener('click', button(b[l], board));
  }
  for (let l = 0; l < i.length; l++) {
    i[l].addEventListener('input', rangeValue(i[l], d[l], l, board));
  }
});