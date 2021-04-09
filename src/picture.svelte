<script>
  export let
    contents,
    globalSettings,
    imageId,
    sizes = "100vw",
    alt = `${imageId}の画像`,
    imgClass,
    click,
    title,
    imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort,
    imageSizes = contents.imageSizes || globalSettings.imageSizes,
    imageDirectory = contents.imageDirectory || globalSettings.imageDirectory;

  function resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId) {
    return imageExtensionsShort.map(ext => {
      return imageSizes.map(size => `${imageDirectory}${imageId}@${size}w.${ext} ${size}w`);
    });
  }

  function getSafeImageExtensionIndex(imageExtensionsShort) {
    return imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  }
</script>

<picture on:click={click} {title}>
  {#each imageExtensionsShort as ext, i}
    <source type="image/{ext}" {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId)[i]}">
  {/each}
  <img class={imgClass} {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId)[getSafeImageExtensionIndex(imageExtensionsShort)]}" {alt}>
</picture>

<style lang="stylus">
  // picture, img
  //   width 100%
</style>