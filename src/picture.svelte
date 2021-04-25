<script>
  import { sync } from './sync-store.js';
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
    loadLazy = true,
    groupId,
    groupImagesCount,
    imageDirectory = contents.imageDirectory || globalSettings.imageDirectory,
    imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort,
    imageSizes = contents.imageSizes || globalSettings.imageSizes,
    tinyImageExtensionsShort = contents.tinyImageExtensionsShort || globalSettings.tinyImageExtensionsShort,
    tinyImageSize = contents.tinyImageSize || globalSettings.tinyImageSize;
  let loading = true;
  addEventListener('load', () => loading = false);

  function resolveSrcsets(loading) {
    return (loading && useTiny ? tinyImageExtensionsShort : imageExtensionsShort).map(ext => {
      if(loading && useTiny){
        return `${imageDirectory}${imageId}@${tinyImageSize}w.${ext} ${tinyImageSize}w`
      }else{
        return imageSizes.map(size => `${imageDirectory}${imageId}@${size}w.${ext} ${size}w`);
      }
    });
  }

  function getSafeImageExtensionIndex() {
    return imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  }
</script>

<picture class={pictureClass} on:click={click} {title} {style}>
  {#each imageExtensionsShort as ext, i}
    <source type="image/{ext}" {sizes} srcset="{resolveSrcsets(loading)[i]}">
  {/each}
  <img class={imgClass} {sizes} srcset="{resolveSrcsets(loading)[getSafeImageExtensionIndex()]}" {alt} {width} {height} loading={loadLazy ? 'lazy' : 'eager'}
  on:load={
    () => {
      if(groupId){
        $sync.loadImagesCount = $sync.loadImagesCount || {};
        $sync.loadImagesCount[groupId] = $sync.loadImagesCount[groupId] > 0 ? $sync.loadImagesCount[groupId] + 1 : 1;
        console.log(imageId);
        if($sync.loadImagesCount[groupId] >= groupImagesCount && !$sync.loadEventDispatched){
          window.dispatchEvent(new CustomEvent('pictureGroup_load', {detail: groupId}));
          $sync.loadEventDispatched = true;
          console.log(imageId);
        }
      }
    }
  }>
</picture>

<style lang="stylus">
  // picture, img
  //   width 100%
</style>