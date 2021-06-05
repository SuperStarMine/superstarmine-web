<script>
  import Nheader from "../components/nav-header.svelte";
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
        {id: 'story', label: 'ストーリー'},
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
  <!-- svelte-ignore a11y-media-has-caption -->
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
      <section class="character" id="character">
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
    <div class="background-transition"></div>
  </div>
  <section class="article-footer" id="info">
    <div class="info">
      <table class="specs">
        <tr>
          <td>タイトル</td>
          <td>
            <span class="break-scope">れーぞく！</span>
            <span class="break-scope">ネクロマンスちゃん</span>
          </td>
        </tr>
        <tr>
          <td>プラットフォーム</td>
          <td>Windows / Mac</td>
        </tr>
        <tr>
          <td>ジャンル</td>
          <td>
            <span class="break-scope">れーぞく</span>
            <span class="break-scope">全方位</span>
            <span class="break-scope">シューティング</span>
          </td>
        </tr>
        <tr>
          <td>プレイ人数</td>
          <td>1人</td>
        </tr>
      </table>
      <div class="production">
        制作
        <Picture imgClass="necromance_ssm-logo" sizes="{$sync.standardWidth}vw"
        contents={{imageExtensionsShort: ['svg']}}
        {globalSettings} imageId="ssm-logo-landscape-white" width="157213" height="60041" loadLazy={true}/>
      </div>
    </div>
    <div class="spacer"></div>
    <a class="twitter-timeline" data-width="300" data-height="400" data-theme="dark" href="https://twitter.com/necromance_chan?ref_src=twsrc%5Etfw">ゲーム『れーぞく！ネクロマンスちゃん』公式アカウントのツイート</a>
    {#if loadTwitterWidget}
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    {/if}
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

    .talk-style-layout
      display flex
      align-items center
      justify-content space-around
      :global(.necromance_character_illustration_picture)
        flex 0 0 30%
      :global(.necromance_character_illustration)
        width 100%
        height auto
      div
        div+div
          margin-top 1em
        p
          margin 0

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

  .background-transition
    height 18em
    width 100%
    background linear-gradient(#1a162900 0%, rgba(22,19,34,1) 80%, rgba(44,38,67,1) 100%)

  .article-footer
    display flex
    @media (max-aspect-ratio: 3/4)
      display block
    width 100%
    box-sizing border-box
    overflow-x hidden
    padding 0 calc((100vw - var(--standardWidth)) / 2)
    background-color #2c2643
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
      .production
        text-align center
        font-weight 500
        :global(.necromance_ssm-logo)
          width 100%
          height auto
    .spacer
      @media (min-aspect-ratio: 16/9)
        flex 0 0 25%
      flex 0 0 5%
      @media (max-aspect-ratio: 3/4)
        height 2em
    :global(#twitter-widget-0)
      flex 1 1 100%
      width 100% !important
      height auto


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