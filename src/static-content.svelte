<script>
  import Button from "./button.svelte";
  export let contents;
  let imageExtensionsShort = contents.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png");
  const imageSizes = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  let imageSrcset = imageExtensionsShort.map(ext => {
    return imageSizes.map(size => `${contents.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
  });
  let article = contents.article;
  let buttonsLayout = contents.bottomButtonsLayout;
  let buttons = contents.bottomButtons;
</script>

<style>
.container
  display: flex
  align-items: center
  justify-content: center

picture
  background-color #fff
  box-shadow: 0 0 10px #ccc
  flex: 0 0 30%
  margin-right: 5%
  img
    width: 100%

.right-column
  flex: 0 0 60%

.text
  margin-bottom: 1em
  p
    margin: 0

.buttons
  display: flex
  align-items: stretch
  width: 100%
</style>

<div class="container">
  <picture>
    {#each imageExtensionsShort as ext, i}
      <source type="image/{ext}" sizes="30vw" srcset="{imageSrcset[i]}">
    {/each}
    <img class="header_logo" sizes="30vw" srcset="{imageSrcset[safeImageExtensionIndex]}" alt="画像">
  </picture>
  <section class="right-column">
    <section class="text">
      {#each article as article}
        <p>{article}</p>
      {/each}
    </section>
    <section class="buttons">
      {#each buttons as button}
        <Button target="{button.target}" title="{button.title}" marginLeft="{buttonsLayout=='right'}" marginRight="{buttonsLayout=='left'}"/>
      {/each}
    </section>
  </section>
</div>