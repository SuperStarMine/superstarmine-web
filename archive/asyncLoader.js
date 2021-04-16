let timer;
function asyncload() {
  console.log(`Fetch: ${document.querySelector('link[as="fetch"]').href} now.`);
  fetch(document.querySelector('link[as="fetch"]').href, {
    method: 'GET',
    mode: 'cors'
  })
    .then((response) => {
    if (response.ok) {
      return response.json().then(resJson => {
        const contents = JSON.parse(JSON.stringify(resJson));
        const container = document.querySelector('#NEWS .card-container');
        for (let i = 0; i < contents.articles.length; i++) {
          const content = contents.articles[i];
          const card = content.link ? document.createElement('a') : document.createElement('div');
          content.link ? card.setAttribute('href', content.link) : 0;
          card.classList.add('main-section_card', 'image-card');
          const banner = document.createElement('div');
          banner.classList.add('image-card_banner');
          const title = document.createElement('h4');
          title.classList.add('image-card_banner_title');
          for (let j = 0; j < content.title.length; j++) {
            const element = document.createElement('span');
            element.classList.add('break-scope');
            element.textContent = content.title[j];
            title.insertAdjacentElement('beforeend', element);
          }
          const time = document.createElement('time');
          time.setAttribute('datetime', content.date.replace(/\//g, '-'));
          time.classList.add('image-card_banner_sub');
          time.textContent = content.date.replace(/-/g, '/');
          banner.insertAdjacentElement('beforeend', title);
          banner.insertAdjacentElement('beforeend', time);
          card.insertAdjacentElement('beforeend', banner);
          const img = document.createElement('img');
          img.classList.add('image-card_image');
          img.setAttribute('sizes', '(min-width: 600px) 32vw, 56vw');
          img.setAttribute('src', `/img/NEWS/NEWS_${content.id}-1000w.${content.img_filename_extension}`);
          const srcset = [];
          for (let j = 2000; j >= 250; j -= 250) {
            srcset.push(`/img/NEWS/NEWS_${content.id}-${j}w.${content.img_filename_extension} ${j}w`);
          }
          img.setAttribute('srcset', `${srcset.join(',')}`);
          img.setAttribute('alt', `${content.title.join('')}の画像`);
          card.insertAdjacentElement('beforeend', img);
          if (content.link) {
            const icon = document.createElement('img');
            icon.classList.add('image-card_link-icon');
            icon.setAttribute('src', '/img/icon/launch-icon-96w.png');
            icon.setAttribute('sizes', '(min-width: 600px) 4vw, 7vw');
            icon.setAttribute('srcset', '/img/icon/launch-icon-48w.png 48w, /img/icon/launch-icon-96w.png 96w');
            icon.setAttribute('alt', 'リンクを示すアイコン');
            card.insertAdjacentElement('beforeend', icon);
          }
          container.insertAdjacentElement('beforeend', card);
        }
        const padding = document.createElement('div');
        padding.classList.add('card_padding-fixer');
        container.insertAdjacentElement('beforeend', padding);
        timer ? clearTimeout(timer) : 0;
      });
    } else {
      timer = setTimeout(() => asyncload(), 3000);
    }
  });
}
document.addEventListener("DOMContentLoaded", e => asyncload(e));