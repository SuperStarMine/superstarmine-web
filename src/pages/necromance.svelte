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

  const videoSourceUrl = 'https://dev.superstarmine.ga/video/necromance_hero.m3u8';
  const hls = new HLS({
    "startFragPrefetch": true
  });
  if (HLS.isSupported()) {
    hls.loadSource(videoSourceUrl);
  }
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
        <h2 class="serif copy">PV</h2>
        <div class="youtube-embed">
          <Yframe contents={{}} {globalSettings} id='kQc84ApB2OM' sizes='@media (orientation: portrait) {$sync.standardWidth}vw, {($sync.standardWidth * 0.975) / 2}vw'/>
        </div>
      </section>
      <section class="story" id="story">
        <h2 class="serif copy">STORY</h2>
        <h3 class="mincho copy"><span class="break-scope">「その</span><span class="break-scope">ヒトの子は、</span><span class="em break-scope">“魔女”</span><span class="break-scope">と呼ぶには</span><span class="break-scope">幼すぎた」</span></h3>
        <p class="mincho">遥か昔──人々の畏怖の対象は悪魔と契約せし者、“魔女”であった。 だが印刷術が発達すると、魔女の脅威は瞬く間に王国中に広まる。 いつしか歴史から姿を消した魔女たちは忘れ去られ、伝説となった。</p>
        <p class="mincho">魔女伝説を調べる民俗学者の貴方はある日、森の中で少女に出会う。 ネクロマンスと名乗る奇妙な少女は尊大な態度で言い放つ──</p>
        <div class="talk-style-layout">
          <Picture pictureClass="necromance_character_illustration_picture" imgClass="necromance_character_illustration" sizes="{$sync.standardWidth * 0.3}vw" {globalSettings} imageId="necromance_character_illustration" width="4299" height="6071" loadLazy={true}/>
          <div>
            <div>
              <p class="mincho em">「アンタ、魔女にキョーミあるんでしょ?</p>
              <p class="mincho em">いいわ、アタシが連れてってあげる!」</p>
            </div>
            <div>
              <p class="mincho">彼女の追う“魔女”とは?</p>
              <p class="mincho">ネクロマンスに隠された過去とは?</p>
              <p class="mincho">そして明らかになる、魔女伝説の全容とは──</p>
            </div>
          </div>
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
    <a class="twitter-timeline" data-width="300" data-height="400" data-theme="dark" href="https://twitter.com/necromance_chan?ref_src=twsrc%5Etfw">ゲーム『れーぞく！ネクロマンスちゃん』公式アカウントのツイート</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </section>
  <Footer contents={footerConfig}/>
</main>

<style lang="stylus">
  vendor(prop, args)
    {prop} args
    -webkit-{prop} args
    -moz-{prop} args

  main
    width 100%
    background-color #1a1629
    color white

  @media (min-aspect-ratio: 3/4)
    .youtube-embed
      width 80%
      margin 0 auto

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

  .article-background
    background-image url("/img/checker.svg")
    background-repeat repeat
    background-position center
    background-size: 5% auto;

  article
    width var(--standardWidth)
    padding 3em calc((100vw - var(--standardWidth)) / 2)

  .story
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

  .background-transition
    height 18em
    width 100vw
    background linear-gradient(#1a162900 0%, rgba(22,19,34,1) 80%, rgba(44,38,67,1) 100%)

  .article-footer
    display flex
    @media (max-aspect-ratio: 3/4)
      display block
    width 100%
    box-sizing border-box
    overflow-x scroll
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
</style>