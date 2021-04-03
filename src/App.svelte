<script>
  import Cframe from "./common-frame.svelte";
  import Nheader from "./nav-header.svelte";
  import Static from "./static-content.svelte";
  import Elist from "./emphasizing-list.svelte";
  import Hero from "./slide-hero.svelte";
  import HeroS from "./slide-hero-swiper.svelte";
  import Desc from "./slide-description.svelte";
  export let settings;
  export let globalSettings;
</script>

<style lang="stylus">
</style>

{#if settings.find(v => v.sectionType == 'navHeader')}
  <Nheader contents={settings.find(v => v.sectionType == 'navHeader').contents} {globalSettings}/>
{/if}
<main style="--standardWidth: {globalSettings.standardWidth}vw; --transitionDuration: {globalSettings.transitionDuration}ms">
  {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}, i}
    {#if sectionType == "slideHero"}
      <HeroS contents={contents || settings.find(v => v.pairId == pairId && v.isParent).contents} {globalSettings} {pairId} {isParent}/>
    {:else if sectionType == "slideDesc"}
      <Desc {contents} {globalSettings} {pairId} {isParent}/>
    {:else if sectionType != "navHeader"}
      <Cframe {id} {title} {subtitle} {themeColor} {globalSettings}>
        {#if sectionType == "static"}
          <Static {contents} {globalSettings}/>
        {:else if sectionType == "emphasizingList"}
          <Elist {contents} {globalSettings}/>
        {/if}
      </Cframe>
    {/if}
  {/each}
</main>