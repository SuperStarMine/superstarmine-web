<script>
  import { onMount, createEventDispatcher } from 'svelte';
  export let
    contents,
    globalSettings,
    imageId,
    sizes = "100vw",
    alt = `${imageId}の画像`,
    width,
    height,
    pictureClass,
    imgClass,
    click,
    title,
    style,
    useTiny,
    imageDirectory = contents.imageDirectory || globalSettings.imageDirectory,
    imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort,
    imageSizes = contents.imageSizes || globalSettings.imageSizes,
    tinyImageExtensionsShort = contents.tinyImageExtensionsShort || globalSettings.tinyImageExtensionsShort,
    tinyImageSize = contents.tinyImageSize || globalSettings.tinyImageSize;
  let loading = true;
  const dispatch = createEventDispatcher();
  addEventListener('load', () => loading = false);

  function resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize) {
    return (loading && useTiny ? tinyImageExtensionsShort : imageExtensionsShort).map(ext => {
      if(loading && useTiny){
        return `${imageDirectory}${imageId}@${tinyImageSize}w.${ext} ${tinyImageSize}w`
      }else{
        return imageSizes.map(size => `${imageDirectory}${imageId}@${size}w.${ext} ${size}w`);
      }
    });
  }

  function getSafeImageExtensionIndex(imageExtensionsShort) {
    return imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  }
</script>

<picture class={pictureClass} on:click={click} {title} {style}>
  {#each imageExtensionsShort as ext, i}
    <source type="image/{ext}" {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize)[i]}">
  {/each}
  <img class={imgClass} {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize)[getSafeImageExtensionIndex(imageExtensionsShort)]}" {alt} {width} {height}>
</picture>

<style lang="stylus">
  // picture, img
  //   width 100%
</style>