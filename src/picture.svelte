<script>
  export let
    contents,
    globalSettings,
    imageId,
    sizes = "100vw",
    alt = `${imageId}の画像`,
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

<picture>
  {#each imageExtensionsShort as ext, i}
    <source type="image/{ext}" {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId)[i]}">
  {/each}
  <img {sizes} srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId)[getSafeImageExtensionIndex(imageExtensionsShort)]}" {alt}>
</picture>

<style lang="stylus">
  picture, img
    width 100%
</style>