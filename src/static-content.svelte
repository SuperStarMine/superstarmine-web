<script>
  export let contents;
  let imageExtensionsShort = contents.imageExtensionsShort;
  const imageSizes = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  let imageSrcset = imageExtensionsShort.map(ext => {
    return imageSizes.map(size => `${contents.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
  });
  let article = contents.article;
</script>

<style>
.container
  padding: 2.5vw
  display: flex
  align-items: center
  justify-content: center

picture
  background-color #fff
  box-shadow: 0 0 10px #ccc
  flex: 0 0 30vw
  margin-right: 5vw
  img
    width: 100%

.text
  flex: 0 0 60vw
</style>

<div class="container">
  <picture>
    {#each imageExtensionsShort as ext, i}
      <source type="image/{ext}" sizes="30vw" srcset="{imageSrcset[i]}">
    {/each}
    <img class="header_logo" src={`${contents.imageDirectory}${contents.imageId}@250w.${imageExtensionsShort.includes("png")?'png':imageExtensionsShort.includes("jpg")?'jpg':'webp'}`} alt="画像">
  </picture>
  <section class="text">
    {#each article as article}
      <p>{article}</p>
    {/each}
  </section>
</div>