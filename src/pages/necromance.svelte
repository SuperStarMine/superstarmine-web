<script>
  import Nheader from "../components/nav-header.svelte";
  import Button from "../components/button.svelte"
  import Footer from "../components/footer.svelte";
  import Picture from "../components/picture.svelte"
  import HLS from "hls.js";
  import { onMount } from 'svelte';
  import Yframe from "../components/youtube-iframe.svelte";
  import { globalSettings } from '../globalSettings.js';
  import { sync } from '../sync-store.js';

  const headerConfig = {
    sectionType: 'navHeader',
    themeColor: '#fff',
    contents: {
      imageId: 'ssm-logo-landscape',
      aspectRatio: { width: 157213, height: 60041 },
      imageExtensionsShort: ['svg'],
      items: [
        {id: 'pv', label: 'PV'},
        {id: 'world', label: '世界観'},
        {id: 'story', label: 'ストーリー'},
        {id: 'characters', label: 'キャラクター'},
        {id: 'system', label: 'システム'},
        {id: 'twitter', label: '公式Twitter'},
        {id: 'info', label: '情報'}
      ]
    }
  },
  footerConfig = {
    copyright: ['&copy; 2021', 'HIBIKI CUBE', 'スーパースターマイン'],
      codeLicense: {
        license: 'mpl-2.0',
        linkLabel: 'GitHub',
        url: 'https://github.com/HIBIKI-CUBE/superstarmine-web',
      },
      assetsLicense: {
        ccType: 'by-nd'
      },
      anchorColor: '#f2b807',
      backgroundColor: '#2c2643'
  },
  textContent =  {
    world: [
      {text: '伝承の 時代から 幾星霜——'},
      {text: '屈強な 木々が 生い茂る その 森には、 だれもが 怖じ恐れる 妖女が 棲む という 言伝がある。'},
      {text: '彼の者は 人々に、 畏怖を 込めて こう呼ばれた—— \\“\\魔女\\”\\と。'}
    ],
    story: [
      {text: '魔女伝説の 調査のため、 森を 訪れた 民俗学者 の男。 しかし 現れたのは、 『自称』 天才魔女 の女の子！？'},
      {text: '「アンタ、 魔女に キョーミ あるんでしょ？ いいわ、 アタシが 連れてって あげる！」', color: '#f2b807'},
      {text: '謎の少女と 学者は 魔女伝説の 全容を 明らかにするため、 魔物 うごめく 森の奥を 目指す——！。'}
    ]
  }

  addEventListener('load', () => {
    (d => {
      var config = {
        kitId: 'egn6fhp',
        scriptTimeout: 3000,
        async: !0
      },
      h=d.documentElement,t=setTimeout(()=>{h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=!1,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=!0;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=!0;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document)
  });

  const videoSourceUrl = (location.hostname == 'localhost' ? '' : 'https://dev.superstarmine.ga') + '/video/necromance_hero.m3u8';
  const hls = new HLS({
    "startFragPrefetch": true
  });
  if (HLS.isSupported()) {
    hls.loadSource(videoSourceUrl);
  }

  let loadTwitterWidget = false;
  onMount(() => {
    const video = document.querySelector("video.hero");
    if(HLS.isSupported()){
      hls.attachMedia(video);
      hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        video.play();
      });
    }else if(video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSourceUrl;
    }
    video.load();
    video.addEventListener('loadedmetadata',() => video.play());
    video.addEventListener('canplay',() => video.play());

    const twitterObserver = new IntersectionObserver(e => {
      if(e[0].isIntersecting && !loadTwitterWidget){
        loadTwitterWidget = true;
        twitterObserver.unobserve(document.querySelector('.twitter-timeline'));
      }
    },{
      rootMargin: '50%'
    });
    twitterObserver.observe(document.querySelector('.twitter-timeline'));

    const scrollSpawner = new IntersectionObserver(e => {
      e.forEach(v => {
        if(v.isIntersecting){
          v.target.classList.add('spawned');
          scrollSpawner.unobserve(v.target);
        }
      })
    },{
      rootMargin: '-40% 0px'
    });
    document.querySelectorAll('.spawn').forEach(v => {
      scrollSpawner.observe(v);
    })
  });
</script>

<Nheader contents={headerConfig.contents} {globalSettings}/>

<main style="--transitionDuration: {globalSettings.transitionDuration}ms;--standardWidth: {$sync.standardWidth}vw">
  <div class="video-hero">
    <video class="hero" loop autoplay playsinline muted></video>
    <div class="filter-layer"></div>
    <Picture imgClass="necromance_logo" sizes="{$sync.standardWidth}vw" {globalSettings} imageId="necromance_logo" width="1643" height="630" loadLazy={true}/>
  </div>
  <div class="article-background">
    <article>
      <section class="pv" id="pv">
        <h2 class="copy spawn">PV</h2>
        <div class="youtube-embed spawn">
          <Yframe contents={{}} {globalSettings} id='kQc84ApB2OM' sizes='@media (orientation: portrait) {$sync.standardWidth}vw, {($sync.standardWidth * 0.975) / 2}vw'/>
        </div>
      </section>
      {#each Object.keys(textContent) as section}
        <section class="{section} center use-wbr" id={section}>
          <h2 class="copy spawn">{section.toUpperCase()}</h2>
          {#if section.toLowerCase() == 'world'}
            <Picture imgClass="world-img center" {globalSettings} imageId="necromance-scenery" loadLazy={true}/>
          {/if}
          {#each textContent[section] as content}
            <p class="spawn" style={content.color ? 'color: ' + content.color : ''}>
              {#each content.text.split(' ').map(v => v.replace(/\\/g, ' ')) as unit}
                {unit}<wbr>
              {/each}
            </p>
          {/each}
        </section>
      {/each}
      <section class="characters" id="characters">
        <h2 class="copy spawn">CHARACTERS</h2>
        <div class="character_profile spawn">
          <Picture imgClass="character_profile-img" pictureClass="character_profile-picture" {globalSettings} imageId="necromance_smile_alpha" loadLazy={true}/>
          <div class="character_profile-text">
            <div class="character_profile-text-name">
              <h3>ネクロマンス</h3>
              <span>NECROMANCE</span>
            </div>
            <div class="character_profile-text-description">
              <p>胸元と頭のリボンがトレードマークの女の子。14歳くらいに見える。</p>
              <p>尊大な態度とそれに不釣り合いな体躯で、学者の前に現れる。</p>
              <p>とある魔女を恨み、復讐を誓っているらしいが——。</p>
            </div>
          </div>
        </div>
        <p class="center">さらに個性豊かなキャラクターが続々登場！</p>
      </section>
      <section class="system" id="system">
        <h2 class="copy spawn">SYSTEM</h2>
        <div class="system-container spawn">
          <Picture imgClass="system-img" pictureClass="system-picture" {globalSettings} imageId="necromance-system1" loadLazy={true}/>
          <div class="system-text">敵弾をスレスレで避けて“れーぞく”！</div>
        </div>
        <div class="system-container spawn">
          <Picture imgClass="system-img" pictureClass="system-picture" {globalSettings} imageId="necromance-system2" loadLazy={true}/>
          <div class="system-text">ド派手な魔法で敵を一掃！</div>
        </div>
        <div class="system-container spawn">
          <Picture imgClass="system-img" pictureClass="system-picture" {globalSettings} imageId="necromance-system3" loadLazy={true}/>
          <div class="system-text">ステージの最後には凶悪な魔物が！</div>
        </div>
      </section>
    </article>
    <section class="twitter" id="twitter">
      <Picture imgClass="twitter-bg-img center" {globalSettings} imageId="necromance-scenery" loadLazy={true}/>
      <div class="content">
        <h2 class="copy">公式Twitter</h2>
        <a class="twitter-timeline" data-width="300" data-height="600" data-theme="dark" href="https://twitter.com/necromance_chan?ref_src=twsrc%5Etfw">ゲーム『れーぞく！ネクロマンスちゃん』公式アカウントのツイート</a>
        {#if loadTwitterWidget}
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        {/if}
        <Button Class="necromance-twitter-button" bg="#1da1f3" target="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3D%2540necromance_chan%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=necromance_chan&tw_p=followbutton">
          <img class="twitter-icon" src="{globalSettings.imageDirectory}twitter.svg" alt="Twitterのアイコン" width="2499" height="2032">
          フォロー
        </Button>
      </div>
      <div class="background-transition"></div>
    </section>
  </div>
  <section class="article-footer" id="info">
    <Picture imgClass="footer-necromance_logo" {globalSettings} imageId="necromance_logo" width="1643" height="630" loadLazy={true}/>
    <div class="info">
      <table class="specs">
        <tr>
          <td>タイトル</td>
          <td class="use-wbr">
            れーぞく！<wbr>ネクロマンスちゃん
          </td>
        </tr>
        <tr>
          <td>プラットフォーム</td>
          <td>Windows / Mac</td>
        </tr>
        <tr>
          <td>ジャンル</td>
          <td class="use-wbr">
            れーぞく<wbr>全方位<wbr>シューティング
          </td>
        </tr>
        <tr>
          <td>プレイ人数</td>
          <td>1人</td>
        </tr>
        <tr>
          <td>制作</td>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <td><a href="javascript:location.assign(location.origin);" style="color:white;text-decoration:underline">スーパー<wbr>スターマイン</a></td>
        </tr>
      </table>
    </div>
    <section class="share">
      <Button Class="necromance-share-buttons" bg="#1da1f3" target="https://twitter.com/intent/tweet?hashtags=ぞくロマ%20%23れーぞくネクロマンスちゃん&original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonHashtag%3D%25E3%2581%259E%25E3%2581%258F%25E3%2583%25AD%25E3%2583%259E%2520%2523%25E3%2582%258C%25E3%2583%25BC%25E3%2581%259E%25E3%2581%258F%25E3%2583%258D%25E3%2582%25AF%25E3%2583%25AD%25E3%2583%259E%25E3%2583%25B3%25E3%2582%25B9%25E3%2581%25A1%25E3%2582%2583%25E3%2582%2593%26buttonRecommendation%3Dnecromance_chan%26buttonText%3D%25E3%2582%258C%25E3%2583%25BC%25E3%2581%259E%25E3%2581%258F%25E5%2585%25A8%25E6%2596%25B9%25E4%25BD%258DSTG%25E3%2580%258E%25E3%2582%258C%25E3%2583%25BC%25E3%2581%259E%25E3%2581%258F%25EF%25BC%2581%25E3%2583%258D%25E3%2582%25AF%25E3%2583%25AD%25E3%2583%259E%25E3%2583%25B3%25E3%2582%25B9%25E3%2581%25A1%25E3%2582%2583%25E3%2582%2593%25E3%2580%258F%25E5%2585%25AC%25E5%25BC%258F%25E3%2582%25B5%25E3%2582%25A4%25E3%2583%2588%26buttonType%3DTweetButton%26buttonUrl%3Dhttps%253A%252F%252Fsuperstarmine.ga%252Fnecromance%252F%26buttonVia%3Dnecromance_chan%26widget%3DButton&ref_src=twsrc%5Etfw&related=necromance_chan&text=れーぞく全方位STG『れーぞく！ネクロマンスちゃん』公式サイト&tw_p=tweetbutton&url=https%3A%2F%2Fsuperstarmine.ga%2Fnecromance%2F&via=necromance_chan">
        <img class="share-icon" src="{globalSettings.imageDirectory}twitter.svg" alt="Twitterのアイコン" width="2499" height="2032">
      </Button>
      <Button Class="necromance-share-buttons" bg="#1877f2" target="https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=https%3A%2F%2Fsuperstarmine.ga%2Fnecromance%2F&display=popup&ref=plugin&src=share_button">
        <img class="share-icon" src="{globalSettings.imageDirectory}facebook.svg" alt="Facebookのアイコン" width="971" height="965">
      </Button>
    </section>
  </section>
  <Footer contents={footerConfig}/>
</main>

<style lang="stylus">
  vendor(prop, args)
    {prop} args
    -webkit-{prop} args
    -moz-{prop} args

  @font-face {
    font-family 'AkazukinPop'
    src url(/font/AkazukinPOP.otf)
  }

  main
    width 100%
    background-color #1a1629
    color white
    font-size 1.2em

  .video-hero
    position relative
    &:before
      content ''
      display block
      padding-bottom calc(9 / 16 * 100%)
    video.hero
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      width 100%
      height auto
    .filter-layer
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      width 100%
      height 100%
      background-color #8888
      vendor(backdrop-filter, blur(2px))
    :global(.necromance_logo)
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      margin auto
      width calc(var(--standardWidth))
      height auto

  @media (min-aspect-ratio: 3/4)
    .youtube-embed
      width 80%
      margin 0 auto

  .article-background
    background-image url("/img/checker.svg")
    background-repeat repeat
    background-position center
    background-size: 5% auto;

  article
    width 100%
    box-sizing border-box
    padding 3em calc((100vw - var(--standardWidth)) / 2)
    overflow hidden

  .use-wbr
    word-break keep-all

  .center
    text-align center

  .spawn
    opacity 0
    transition all var(--transitionDuration) ease 0ms

  .pv
    .spawn
      transform scale(0.9) translateY(10%)

  :global(.world-img)
    width 70%

  section + section
    margin-top 12em

  .story
    .spawn
      &:nth-child(odd)
        transform translateX(-30%)
      &:nth-child(even)
        transform translateX(30%)
    >p
      text-align center
      @media (min-aspect-ratio: 3/4)
        width 80%
        margin 0 auto
    >p+p
      margin-top 1em

  .character_profile
    display flex
    justify-content space-between
    align-items flex-start

  :global(.character_profile-picture)
    flex 0 0 30%

  :global(.character_profile-img)
    width 100%
    height auto

  .character_profile-text
    flex 0 0 65%
    & h3
      font-size 2em
      margin 0.5em 0
      color #f2b807

  .system-container
    display flex
    flex-direction column

  :global(.system-picture)
    width 70%
    .system-container:nth-child(even) &
      align-self flex-start
    .system-container:nth-child(odd) &
      align-self flex-end

  :global(.system-img)
    width 100%

  .system-text
    font-family AkazukinPop
    font-style normal
    font-weight 800
    font-size 10vw
    color white
    vendor(text-stroke, 2px #000)
    text-shadow 2px 2px 0px #F2B807
    transform-origin center
    .system-container:nth-child(even) &
      transform scale(0.3) rotate(6deg) translateY(calc((var(--standardWidth) * 0.7 / 16 * 9 * 2.5 + 10vw * 0.3) * -1))
    .system-container:nth-child(odd) &
      transform scale(0.3) rotate(-6deg) translateX(calc((var(--standardWidth) * 0.7 / 2 * 1.5) * -1)) translateY(calc((var(--standardWidth) * 0.7 /16 * 9 * 2.5 + 10vw * 0.3) * -1))
    white-space nowrap

  .twitter
    position relative

    .content
      display flex
      flex-direction column
      position relative
      padding calc((100% - var(--standardWidth) * var(--footerStandardWidthCoefficient)) / 4) 0

    :global(#twitter-widget-0)
      width calc(var(--standardWidth) * var(--footerStandardWidthCoefficient)) !important
      margin 0 calc((100% - var(--standardWidth) * var(--footerStandardWidthCoefficient)) / 2) !important
      height 100vmin !important

    :global(.twitter-bg-img)
      width 100%
      height 100%
      object-fit cover
      position absolute
      filter blur(2px) brightness(0.7)
      transform scale(1.01)
      top 0

    :global(.necromance-twitter-button)
      display inline-block
      margin 1em auto !important
      width auto !important
      padding 0.5em
      font-family AkazukinPop

    .twitter-icon
      width auto
      height 1em
      display inline-block

  .background-transition
    position relative
    bottom -11px
    height 6em
    width 100%
    background linear-gradient(#1a162900 0%, rgba(22,19,34,1) 80%, rgba(44,38,67,1) 100%)

  :root
    --footerStandardWidthCoefficient 0.5
    @media screen and (orientation: portrait)
      --footerStandardWidthCoefficient 0.7

  .article-footer
    display flex
    flex-direction column
    width 100%
    box-sizing border-box
    overflow-x hidden
    padding calc(11px + 5em) calc((100vw - var(--standardWidth) * var(--footerStandardWidthCoefficient)) / 2)
    background-color #2c2643

    :global(.footer-necromance_logo)
      width 100%
      height auto

    .info
      flex 1 1 100%
      display flex
      flex-direction column
      justify-content space-around
      .specs
        width 100%
        border-spacing 0.5em 1ch
        td
          &:first-child
            white-space nowrap
            text-align center
            background-color #413c56
            padding 0.5em 1ch

    .share
      text-align center

      :global(.necromance-share-buttons)
        display inline-block
        margin 0 !important
        width 2em !important
        height 2em
        padding 0.5em

      .share-icon
        width auto
        height 100%

  .serif
    font-family nocturne-serif;
    font-weight 400
    font-style normal

  .mincho
    font-family: yu-mincho-pr6n;
    font-weight: 400;
    font-style: normal;

  .copy
    font-size 3em
    text-align center
    h3&
      font-size calc(3em * 40/48)

  .em
    color #f2b807

  :global(.spawned)
    transform none !important
    opacity 1 !important
</style>