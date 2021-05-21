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
        {id: 'top', label: '作品'},
        {id: 'news', label: 'ニュース'},
        {id: 'about', label: 'チームについて'},
        {id: 'members', label: 'メンバー'}
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
      transparent: true,
      anchorColor: '#f2b807'
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

  const videoSourceUrl = '../../video/necromance_hero.m3u8';
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
  <article>
    <section class="pv">
      <h2 class="serif copy">PV</h2>
      <div class="youtube-embed">
        <Yframe contents={{}} {globalSettings} id='kQc84ApB2OM' sizes='@media (orientation: portrait) {$sync.standardWidth}vw, {($sync.standardWidth * 0.975) / 2}vw'/>
      </div>
    </section>
    <section class="story">
      <h2 class="serif copy">STORY</h2>
      <h3 class="mincho copy"><span class="break-scope">「その</span><span class="break-scope">ヒトの子は、</span><span class="em">“魔女”</span><span class="break-scope">と呼ぶには</span><span class="break-scope">幼すぎた」</span></h3>
      <p class="mincho">遥か昔──人々の畏怖の対象は悪魔と契約せし者、“魔女”であった。 だが印刷術が発達すると、魔女の脅威は瞬く間に王国中に広まる。 いつしか歴史から姿を消した魔女たちは忘れ去られ、伝説となった。</p>
      <p class="mincho">魔女伝説を調べる民俗学者の貴方はある日、森の中で少女に出会う。 ネクロマンスと名乗る奇妙な少女は尊大な態度で言い放つ──</p>
      <div class="talk-style-layout">
        <Picture pictureClass="necromance_character_illustration_picture" imgClass="necromance_character_illustration" sizes="{$sync.standardWidth}vw" {globalSettings} imageId="necromance_character_illustration" width="4299" height="6071" loadLazy={true}/>
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
  <Footer contents={footerConfig}/>
</main>

<style lang="stylus">
  vendor(prop, args)
    {prop} args
    -webkit-{prop} args
    -moz-{prop} args

  main
    width 100%
    background-color #2c2643
    color white

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

  article
    width var(--standardWidth)
    margin 0 auto
    padding 3em 0

  .story
    >p
      width 80%
      margin 0 auto
      text-align center
    >p+p
      margin-top 1em

    .talk-style-layout
      display flex
      align-items center
      :global(.necromance_character_illustration_picture)
        flex 0 0 30%
      :global(.necromance_character_illustration)
        width 100%
        height auto
      div
        flex-basis 100%
        div+div
          margin-top 1em
        p
          margin 0

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