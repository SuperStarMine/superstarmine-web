import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    settings: [
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
        contentType: 'cycle'
      },
      {
        sectionType: 'static',
        title: 'ABOUT',
        themeColor: '#f15a23',
        contentType: 'static',
        contents: {
          imageId: 'ssm-logo-landscape',
          imageDirectory: '/img/',
          imageExtensionsShort: ['webp', 'png'],
          article: [
            "スーパースターマインは大学サークル発、新進気鋭のゲーム制作チーム。",
            "面白いものが大好きです。"
          ],
          bottomButton: {
            type: 'anchor',
            title: 'お問い合わせ・連絡',
            action: 'https://google.com'
          }
        }
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