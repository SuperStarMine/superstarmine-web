import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    contents: [
      {
        sectionType: 'slideshow',
        pairId: 'hero'
      },
      {
        sectionType: 'cycle',
        pairId: 'hero'
      },
      {
        sectionType: 'cycle',
        cycleType: 'compact',
        title: 'NEWS',
        subtitle: 'チームからのお知らせ',
        themeColor: '#ff0200',
        contentType: 'cycle',
        contents: []
      },
      {
        sectionType: 'static',
        title: 'ABOUT',
        themeColor: '#f15a23',
        contentType: 'static',
        contents: []
      },
      {
        sectionType: 'cards',
        title: 'MEMBERS',
        themeColor: '#f7931d'
      }
    ]
  }
});

export default app;