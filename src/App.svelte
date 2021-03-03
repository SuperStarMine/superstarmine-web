<script>
  import Cframe from "./common-frame.svelte";
  import Static from "./static-content.svelte";
  import Elist from "./emphasizing-list.svelte"
  export let settings;
</script>

<style>
</style>

<main style="--standardWidth: {settings.find(v => v.sectionType == 'globalSettings').standardWidth}vw">
    {:else if sectionType != "globalSettings"}
  {/each}
</main>