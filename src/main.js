import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    globalSettings: {
      standardWidth: '80', // vw
      imageDirectory: './img/',
      imageExtensionsShort: ['webp', 'png'],
      imageSizes: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
      transitionDuration: 500, //ms
    },
    settings: [
      {
        sectionType: 'navHeader',
        themeColor: '#fff',
        contents: {
          imageId: 'ssm-logo-landscape',
          items: [
            {id: 'works', label: '作品'},
            {id: 'news', label: 'ニュース'},
            {id: 'about', label: 'チームについて'},
            {id: 'members', label: 'メンバー'}
          ]
        }
      },
      {
        sectionType: 'slideHero',
        pairId: 'hero',
        id: 'info'
      },
      {
        sectionType: 'slideDesc',
        pairId: 'hero',
        isParent: true,
        //Aspect ratio of slides must be 16:9
        contents: {
          articles: [
            {
              title: 'れーぞく！ネクロマンスちゃん',
              subtitle: 'れーぞく全方位シューティングゲーム',
              themeColor: '#fdaa2b',
              imageId: 'necromance_ss',
              alt: 'れーぞく！ネクロマンスちゃんのプレイ画面',
              description: [
                'スーパースターマイン第一作目のSTG。',
                '敵弾をスレスレでかわすことで強大な必殺技をブッ放せる、という『れーぞくシステム』を搭載。リスクとリターンの取捨選択に手に汗握る、白熱したバトルを楽しめる。',
                'ストーリーや世界観をこだわり抜き、カットイン映像やボイス付きシナリオパートといったリッチな表現にも挑戦。',
                'ゲームクリエイター甲子園2020にて総合大賞3位、審査員特別賞、話題賞受賞。コミックマーケット97、デジゲー博2020に出展。',
                'Boothにて体験版を配信中。'
              ]
            },
            {
              title: 'SPINNER',
              subtitle: '新感覚ホッケーアクションゲーム',
              themeColor: '#000',
              imageId: 'spinner_ss',
              alt: 'SPINNERのプレイ画面',
              description: [
                'ハンドルコントローラーを用いて戦う1vs1のホッケーゲーム。',
                'ゴールがなく、パックが端のラインを超えると対となるラインにワープするという仕様が特徴。',
                'GCGEXPO2019にて総合優勝。',
                '2020年2月に開催され、200名近くの業界人が参加したゲーム業界年始あいさつ会では体験会を開催し、プロクリエイターの方々から建設的なフィードバックをいただいた。'
              ]
            },
            {
              title: 'CUPRUNMEN',
              subtitle: 'VRMタイムアタックランゲーム',
              themeColor: '#1f83d8',
              imageId: 'cup-run_ss',
              alt: 'CUPRUNMENのプレイ画面',
              description: [
                '初となるフルリモート体制で制作したランゲーム。',
                '技術的にユニークな点として、「プレイヤーの向きと',
                'ステージの法線ベクトルから溢れるスープ量を算出する」という処理を行っている。',
                'また、ローカルのVRMアバターをゲームに用いるという試みを行った。',
                'ニコニコネット超会議超ハッカソンに出展。'
              ]
            },
            {
              title: 'フォーリンパフェ',
              subtitle: 'パフェ積みアクションゲーム',
              themeColor: '#4ae0ef',
              imageId: 'fall_in_parfait-ss1',
              alt: 'フォーリンパフェのプレイ画面',
              description: [
                '2020年8月に開催されたUnity1Weekで制作したゲーム。',
                '『上から落ちてくる材料を器でキャッチしてパフェを作る』というシンプルな操作性ながら、パフェを大きくなるにつれて爆弾に当たりやすくなる、オンラインランキングの実装といった工夫により、上級者にとってもやり込みがいのあるゲームとなった。',
                '一番の特長は『フォトモード』で、プレイヤーは自分の作ったパフェを撮影してTwitterに投稿することができる。',
                'ゲームデザインの中にマーケティングの視点を持ち込んだ、ゲーム“商品”としての草分け的な作品となった。',
                'Unity1Weekゲームジャムにて約500作品中総合部門46位、絵作り部門35位獲得。',
                'デベロッパーズゲームコンテスト2020にて企業賞受賞。',
                '福岡ゲームコンテスト2021、Ohayoo Casual Game Contestに出展。'
              ]
            },
            {
              title: '爆買いマーケット',
              subtitle: '爆買いアクションランゲーム',
              themeColor: '#c65017',
              imageId: 'fall_in_parfait-ss1',
              alt: '',
              description: [
                'フォーリンパフェに続く、Unity1Week二作目。',
                'ショッピングカートに搭乗してスーパーマーケットを爆走し、床の商品を拾ったり商品棚や他のプレイヤーを攻撃することでスコアを稼ぐ。',
                '今回は初めてAIプレイヤーを導入した。それぞれのAIに性格付け（攻撃型・収集型・逃亡型）をすることで、プレイヤーは毎回刺激的なゲーム展開を楽しめるようになった。',
                'Unity1Weekゲームジャムに出展。'
              ]
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
        id: 'news',
        contents: {
          listItemsCount: 5,
          autoCyclePeriodInMs: 5000,
          stopAutoCycleWhenClicked: true,
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
        themeColor: '#f7931d',
        contents: {
          logoImageId: 'ssm-logo',
          imageDirectory: './img/members/',
          cards: [
            {
              name: 'マチコー',
              imageId: 'machiko',
              post: [
                'リーダー',
                'プランナー'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'MachiCollider'
                },
                {
                  name: 'facebook',
                  id: 'MachiCollider'
                },
                {
                  name: 'note',
                  id: 'machikou_mk2'
                }
              ]
            },
            {
              name: 'いーだ',
              imageId: 'i-da',
              post: [
                'プログラマー',
                'マスタリングエンジニア'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'GoodPaddyField5'
                },
                {
                  name: 'note',
                  id: '203_'
                }
              ]
            },
            {
              name: 'Amu',
              imageId: 'amu',
              post: [
                'UI/ロゴデザイン',
                'エフェクト'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'Amu＿dsgn'
                }
              ]
            },
            {
              name: 'HIBIKI CUBE',
              imageId: 'hibiki',
              post: [
                'Webエンジニア',
                'CGモデラー'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'hibiki_cube'
                },
                {
                  name: 'github',
                  id: 'HIBIKI-CUBE'
                },
                {
                  name: 'qiita',
                  id: 'HIBIKI-CUBE'
                }
              ]
            },
            {
              name: 'Matsu',
              imageId: '',
              post: [
                'プログラマー',
                'レベルデザイナ'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'sake_unity_stu'
                },
                {
                  name: 'github',
                  id: 'AtaruMatsudaira'
                }
              ]
            },
            {
              name: 'ナミー',
              imageId: '',
              post: [
                'デバッガー'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'fi_matsu'
                }
              ]
            },
            {
              name: 'えちょ',
              imageId: 'echo',
              post: [
                'レベルデザイン'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'ysXKPSlvMZqVtIW'
                }
              ]
            },
            {
              name: '十二月ねこ',
              imageId: '',
              post: [
                'CGモデラー'
              ],
              accounts: [
                {
                  name: 'twitter',
                  id: 'Subamaru_7'
                }
              ]
            },
          ]
        }
      }
    ]
  }
});

export default app;