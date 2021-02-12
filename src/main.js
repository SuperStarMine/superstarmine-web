import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    contents: [
      {
        titleType: 'slideshow'
      },
      {
        titleType: 'static',
        title: 'NEWS',
        subtitle: 'チームからのお知らせ',
        themeColor: '#ff0200'
      },
      {
        titleType: 'static',
        title: 'ABOUT',
        themeColor: '#f15a23'
      },
      {
        titleType: 'static',
        title: 'MEMBERS',
        themeColor: '#f7931d'
      }
    ]
  }
});

export default app;