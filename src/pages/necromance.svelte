<script>
  import Nheader from "../components/nav-header.svelte";
  import Picture from "../components/picture.svelte"
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

</script>

<Nheader contents={headerConfig.contents} {globalSettings}/>

<main style="--standardWidth: {$sync.standardWidth}%">
  <div class="video-helo">
    <Picture imgClass="necromance_logo" sizes="{$sync.standardWidth}vw" {globalSettings} imageId="necromance_logo" width="1643" height="630" loadLazy={true}/>
  </div>
  <span class="selif">PV</span>
</main>

<style lang="stylus">
  main
    width 100%
    min-height calc(100% - var(--base-size))
    background-color #2c2643
    color white

  .video-helo
    position relative
    &:before
      content ''
      display block
      padding-bottom calc(9 / 16 * 100%)
    :global(.necromance_logo)
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      margin auto
      width calc(var(--standardWidth) * 0.8)
      height auto

  .selif
    font-family nocturne-serif
    font-weight 400
    font-style normal
</style>