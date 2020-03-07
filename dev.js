addEventListener('load', () => {
  let i = [];
  let d = [];
  let color = [255, 255, 255, 0.5];
  i[0] = document.getElementById('dev-red');
  i[1] = document.getElementById('dev-green');
  i[2] = document.getElementById('dev-blue');
  i[3] = document.getElementById('dev-alpha');
  i[4] = document.getElementById('dev-blur');
  d[0] = document.getElementById('disp-red');
  d[1] = document.getElementById('disp-green');
  d[2] = document.getElementById('disp-blue');
  d[3] = document.getElementById('disp-alpha');
  d[4] = document.getElementById('disp-blur');
  let board = document.getElementById('hero_background-blur');
  var rangeValue = function (elem, target, index, board) {
    return function(){
      target.innerHTML = elem.value;
      if (index == 4) {
        board.style.setProperty('-webkit-backdrop-filter', `blur(${elem.value}px)`);
        board.style.setProperty('-moz-backdrop-filter', `blur(${elem.value}px)`);
        board.style.setProperty('backdrop-filter', `blur(${elem.value}px)`);
      } else {
        color[index] = elem.value;
        board.style.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
      }
    }
  }
  for (let l = 0; l < i.length; l++) {
    i[l].addEventListener('input', rangeValue(i[l], d[l], l, board));
  }
});