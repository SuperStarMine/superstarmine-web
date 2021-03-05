<script>
  import Cframe from "./common-frame.svelte";
  import Static from "./static-content.svelte";
  import Elist from "./emphasizing-list.svelte";
  import Hero from "./slide-hero.svelte";
  import Desc from "./slide-description.svelte";
  export let settings;
  export let globalSettings;
</script>

<style lang="stylus">
</style>

<main style="--standardWidth: {globalSettings.standardWidth}vw; --transitionDuration: {globalSettings.transitionDuration}ms">
  {#each settings as {title, subtitle, themeColor, sectionType, contents, pairId, isParent}, i}
    {#if sectionType == "slideHero"}
      <Hero contents={contents || settings.find(v => v.pairId == pairId && v.isParent).contents} {globalSettings} {pairId} {isParent}/>
    {:else if sectionType == "slideDesc"}
      <Desc {contents} {globalSettings} {pairId} {isParent}/>
    {:else if sectionType != "globalSettings"}
      <Cframe {title} {subtitle} {themeColor} {globalSettings}>
        {#if sectionType == "static"}
          <Static {contents} {globalSettings}/>
        {:else if sectionType == "emphasizingList"}
          <Elist {contents} {globalSettings}/>
        {/if}
      </Cframe>
    {/if}
  {/each}
</main>