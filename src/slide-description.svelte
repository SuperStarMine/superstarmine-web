<script>
import Cframe from "./common-frame.svelte";
  import { sync } from './sync-store.js';
  export let pairId, isParent, globalSettings, contents;
  let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  let imageSizes = contents.imageSizes || globalSettings.imageSizes;
  if(isParent) $sync[pairId]
    = {
      slide: 0,
      inTransition: false,
      transitionOffset: 0
    };
</script>

<Cframe title={contents.articles[$sync[pairId].slide].title} subtitle={contents.articles[$sync[pairId].slide].subtitle} themeColor={contents.articles[$sync[pairId].slide].themeColor}>
  {#if Array.isArray(contents.articles[$sync[pairId].slide].description)}
    {#each contents.articles[$sync[pairId].slide].description as p}
      <p>{p}</p>
    {/each}
  {:else}
    {contents.articles[$sync[pairId].slide].description}
  {/if}
</Cframe>

<style lang="stylus">
</style>