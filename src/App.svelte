<script>
  import Cframe from "./common-frame.svelte";
  import Static from "./static-content.svelte";
  import Elist from "./emphasizing-list.svelte"
  export let settings;
</script>

<style>
</style>

<main>
  {#each settings as {title, subtitle, themeColor, sectionType, contents}}
    <Cframe {title} {subtitle} {themeColor}>
      {#if sectionType == "static"}
        <Static {title} {contents} />
      {:else if sectionType == "emphasizingList"}
        <Elist {contents} />
      {/if}
    </Cframe>
  {/each}
</main>