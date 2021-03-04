<script>
  import Cframe from "./common-frame.svelte";
  import { sync } from './sync-store.js';
  export let pairId;
  export let isParent;
  export let contents;
  if(isParent) $sync[pairId]
    = {
      slide: 0,
      inTransition: false,
      transitionOffset: 0
    };
</script>

<Cframe title={contents.articles[$sync[pairId].slide].title} subtitle={contents.articles[$sync[pairId].slide].subtitle} themeColor={contents.articles[$sync[pairId].slide].themeColor}>
  {contents.articles[$sync[pairId].slide].description}
</Cframe>

<style>
  div
    width: 100%
</style>