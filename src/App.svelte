<script>
  import Cframe from "./common-frame.svelte";
  import Nheader from "./nav-header.svelte";
  import Static from "./static-content.svelte";
  import Dlist from "./date-list.svelte";
  import HeroS from "./slide-hero-swiper.svelte";
  import Desc from "./slide-description.svelte";
  import Footer from "./footer.svelte";
  import Cards from "./cards.svelte";
  export let settings, globalSettings;
  let standardWidth;
  const setStandardWidth = (media, v) => standardWidth = media.matches ? v.value : globalSettings.standardWidths[globalSettings.standardWidths.findIndex(w => w.mediaQuery == 'default')].value;
  globalSettings.standardWidths.forEach(v => {
    if(v.mediaQuery && v.mediaQuery != 'default') {
      let media = matchMedia(`(${v.mediaQuery})`);
      if(!standardWidth)setStandardWidth(media, v);
      media.addEventListener('change', () => setStandardWidth(media, v));
    }
  });

  let loadAnalytics = false;
  addEventListener('pictureGroup_load', e => setTimeout(() => loadAnalytics = e.detail == 'slideHero'));
</script>

<svelte:head>
  {#if loadAnalytics}
    <link rel="preconnect" href="https://www.google-analytics.com">
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-158103398-1"></script>
    <script async>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-158103398-1');
    </script>
  {/if}
</svelte:head>

<style lang="stylus">
</style>

{#if settings.find(v => v.sectionType == 'navHeader')}
  <Nheader contents={settings.find(v => v.sectionType == 'navHeader').contents} {globalSettings}/>
{/if}
<main style="--transitionDuration: {globalSettings.transitionDuration}ms;--standardWidth: {standardWidth}vw">
  {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}, i}
    {#if sectionType == "slideHero"}
      <HeroS contents={contents || settings.find(v => v.pairId == pairId && v.isParent).contents} {globalSettings} {pairId} {standardWidth}/>
    {:else if sectionType == "slideDesc"}
      <Desc {contents} {globalSettings} {pairId} {standardWidth}/>
    {:else if sectionType == "footer"}
      <Footer {contents}/>
    {:else if sectionType != "navHeader"}
      <Cframe {id} {title} {subtitle} {themeColor}>
        {#if sectionType == "static"}
          <Static {contents} {globalSettings} {standardWidth}/>
        {:else if sectionType == "dateList"}
          <Dlist {contents}/>
        {:else if sectionType == "cards"}
          <Cards {contents} {globalSettings} {standardWidth}/>
        {/if}
      </Cframe>
    {/if}
  {/each}
</main>