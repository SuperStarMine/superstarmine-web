import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    settings: [
      {
        sectionType: 'globalSettings',
        standardWidth: '80', // vw
      },
      {
        sectionType: 'slideHero',
        pairId: 'hero'
      },
      {
        sectionType: 'slideDesc',
        pairId: 'hero',
        isParent: true,
        contents: {
          imageDirectory: '/img/',
          imageExtensionsShort: ['webp', 'png'],
          articles: [
            {
              title: 'フォーリンパフェ',
              subtitle: 'パフェが落ちるやつ',
              themeColor: '#4ae0ef',
              imageId: 'fall_in_parfait-ss1',
              alt: 'テスト画像1',
              description: 'フォーリンパフェの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
            },
            {
              title: 'Cup Runmen',
              subtitle: 'VRMカップ麺ボブスレーレース',
              themeColor: '#1f83d8',
              imageId: 'cup-run_ss',
              alt: 'テスト画像2',
              description: 'Cup Runmenの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
            },
            {
              title: 'れーぞく！ネクロマンスちゃん',
              subtitle: 'コミカルポップ全方位シューティング',
              themeColor: '#fdaa2b',
              imageId: 'necromance_ss',
              alt: 'テスト画像3',
              description: 'れーぞく！ネクロマンスちゃんの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
            },
            {
              title: 'SPINNER',
              subtitle: 'ハイスピード対戦アクション',
              themeColor: '#000',
              imageId: 'spinner_ss',
              alt: 'テスト画像4',
              description: 'SPINNERの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
            }
          ]
        }
      },
      {
        sectionType: 'emphasizingList',
        cycleType: 'compact',
        title: 'NEWS',
        subtitle: 'チームからのお知らせ',
        themeColor: '#ff0200',
        contents: {
          listItemsCount: 5,
          autoCyclePeriodInMs: 5000,
          stopAutoCycleWhenClicked: true,
          imageDirectory: '/img/',
          imageExtensionsShort: ['webp', 'png'],
          articles: [
            {
              imageId: 'ssm-logo-landscape',
              title: '【速報】まちこー、無事に東京に帰還',
              article: [
                "スーパースターマインのリーダーのまちこーが東京に帰ってきました。",
                "民が無事を祈る中、まちこーは成田空港に降り立ちました。",
                "現場では5000人のファンが出迎えたそうです。"
              ]
            },
            {
              imageId: 'ssm-logo',
              title: '【奇跡】まちこーのアパート、無傷',
              article: [
                "先日の地震による被害が心配されていたまちこー宅ですが、",
                "奇跡的に被害が出ていなかったということです。",
                "現場では5000人のファンが歓声を上げたそうです。"
              ]
            },
            {
              imageId: 'ssm-logo-landscape',
              title: '【速報】ワイドモニター、歩夢宅に導入',
              article: [
                "つい先ほど、我らがデザイナーの歩夢の家にワイドモニターが導入されました",
                "早速設置を進めているとのことです。"
              ]
            },
            {
              imageId: 'ssm-logo',
              title: '【悲報】モニターアームのネジ、落ちる',
              article: [
                "我らがデザイナーの歩夢がモニターの設置をしていたところ、モニターアームのねじが穴に落下してしまったそうです。",
                "Twitterでも助けを求めており、懸命な作業が続けられています。"
              ]
            },
            {
              imageId: 'ssm-logo-landscape',
              title: '【速報】モニターアームのネジ、見つかる',
              article: [
                "我らがデザイナーの歩夢が懸命な救出活動を行なっていたモニターアームのネジですが、つい先ほど無事に救出されたそうです。",
                "救出の際には磁石を搭載した専用の高価なドライバーが用いられたそうです。",
                "無事に救出されたことを受け、本人は次のようにコメントしています。",
                "「非常に過酷なミッションでしたが、なんとかやり遂げることができました。これも全て応援してくださったみなさんのおかげです」"
              ]
            }
          ]
        }
      },
      {
        sectionType: 'static',
        title: 'ABOUT',
        themeColor: '#f15a23',
        contents: {
          imageId: 'ssm-logo-landscape',
          imageDirectory: '/img/',
          imageExtensionsShort: ['webp', 'png'],
          article: [
            "スーパースターマインは大学サークル発、新進気鋭のゲーム制作チーム。",
            "面白いものが大好きです。"
          ],
          bottomButtonsLayout: 'left',
          bottomButtons: [
            {
              title: 'お問い合わせ・連絡',
              target: 'https://google.com'
            },
            {
              title: 'Test',
              target: 'toggleExpand'
            }
          ]
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