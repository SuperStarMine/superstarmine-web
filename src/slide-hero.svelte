<script>
  import { sync } from './sync-store.js';
  import supportsWebP from 'supports-webp';
  export let contents;
  export let pairId;
  export let standardWidth;
  let imageExtensionsShort = contents.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  const imageSizes = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];

  let imageSrcsets = [];
  for(let i = 0; i < contents.articles.length; i++) {
    imageSrcsets[i] = imageExtensionsShort.map(ext => {
      return imageSizes.map(size => `${contents.imageDirectory}${contents.articles[i].imageId}@${size}w.${ext} ${size}w`);
    });
  }

  const imageColumn = [-1, 0, 1, 2];

  const transitionDuration = 200;
  let slideOffset = '0vw';
  function slide(v) {
    $sync[pairId].inTransition = true;
    slideOffset = `${80 * v}vw`;
    if($sync[pairId].slide + v >= imageSrcsets.length){
      $sync[pairId].transitionOffset = v - imageSrcsets.length
    }else if($sync[pairId].slide + v < 0){
      $sync[pairId].transitionOffset = v + imageSrcsets.length
    }else{
      $sync[pairId].transitionOffset = v
    }
    setTimeout(() => {
      $sync[pairId].inTransition = false;
        slideOffset = '0vw';
        $sync[pairId].slide += $sync[pairId].transitionOffset;
    }, transitionDuration);
  }

</script>

<svelte:head>
  {#each imageSrcsets as srcset, i}
    <link rel="preload" as="image" href="{contents.imageDirectory}{contents.articles[0].imageId}@{imageSizes.find(v => v >= innerWidth * devicePixelRatio * standardWidth / 100) || imageSizes.sort((a, b) => b - a)[0]}w.{imageExtensionsShort[safeImageExtensionIndex]}" imagesrcset="{srcset}" imagesizes="80vw">
  {/each}
</svelte:head>

<div class="container" style="--transitionDuration: {transitionDuration}ms; --slideOffset: {slideOffset}">
  {#each imageColumn as v}
    <picture class="{$sync[pairId].inTransition ? 'inTransition' : ''}" on:click={() => slide(v)}>
      {#each imageExtensionsShort as ext, i}
        <source type="image/{ext}" sizes="80vw" srcset="{imageSrcsets.slice($sync[pairId].slide + v == imageSrcsets.length ? 0 : $sync[pairId].slide + v)[i]}">
      {/each}
      <img sizes="80vw" srcset="{imageSrcsets.slice($sync[pairId].slide + v == imageSrcsets.length ? 0 : $sync[pairId].slide + v)[safeImageExtensionIndex]}" alt="画像">
    </picture>
  {/each}
</div>

<style>
.container
  display: flex
  overflow: hidden
picture
  width: var(--standardWidth)
  height: calc(var(--standardWidth) / 16 * 9)
  transform: translateX(calc(-70vw))
  &.inTransition
    transition: transform var(--transitionDuration) cubic-bezier(0.87, 0, 0.13, 1) 0s
    transform: translateX(calc(-70vw - var(--slideOffset)))
  img
    object-fit: cover
    width: var(--standardWidth)
    height: calc(var(--standardWidth) / 16 * 9)
</style>
