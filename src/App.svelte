<script>
  import Cframe from "./common-frame.svelte";
  import Static from "./static-content.svelte";
  import Elist from "./emphasizing-list.svelte";
  import Hero from "./slide-hero.svelte";
  import Desc from "./slide-description.svelte";
  export let settings;
  let standardWidth = settings.find(v => v.sectionType == 'globalSettings').standardWidth;
</script>

<style>
</style>

<main style="--standardWidth: {standardWidth}vw">
  {#each settings as {title, subtitle, themeColor, sectionType, contents, pairId, isParent}, i}
    {#if sectionType == "slideHero"}
      {#if !contents}
        <Hero contents={settings.find(v => {return v.pairId == pairId && v.isParent}).contents} {standardWidth} {pairId}/>
      {:else}
        <Hero {contents} {standardWidth} {pairId}/>
      {/if}
    {:else if sectionType == "slideDesc"}
      <Desc {contents} {pairId} {isParent}/>
    {:else if sectionType != "globalSettings"}
      <Cframe {title} {subtitle} {themeColor}>
        {#if sectionType == "static"}
          <Static {contents} />
        {:else if sectionType == "emphasizingList"}
          <Elist {contents} />
        {/if}
      </Cframe>
    {/if}
  {/each}
</main>