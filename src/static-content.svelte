<script>
  export let contents;
  let imageExtensionsShort = contents.imageExtensionsShort;
  const imageSizes = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  let imageSrcset = imageExtensionsShort.map(ext => {
    return imageSizes.map(size => `${contents.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
  });
  let article = contents.article;
  let buttonsLayout = contents.bottomButtonsLayout;
  let buttons = contents.bottomButtons;
  let hasHttpProtocol = new RegExp("^https?:\/\/");
  let isAnchor = buttons.map(i => hasHttpProtocol.test(i.target));
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

.buttons
  display: flex
  align-items: stretch
  width: 100%
  a, button
    margin: 0 10% 0
    width: 45%
    box-sizing: border-box
    border: none
    border-radius: 0.5ch
    padding: 0.5ch
    font-size: 1em
    text-align: center
    color: #fff
    background-color: var(--themeColor)
</style>

<div class="container">
  <picture>
    {#each imageExtensionsShort as ext, i}
      <source type="image/{ext}" sizes="30vw" srcset="{imageSrcset[i]}">
    {/each}
    <img class="header_logo" alt="画像">
  </picture>
  <section class="right-column">
    <section class="text">
      {#each article as article}
        <p>{article}</p>
      {/each}
    </section>
    <section class="buttons">
      {#each buttons as button, i}
        {#if isAnchor[i]}
          <a href="{button.target}" style="margin-{buttonsLayout}: 0">{button.title}</a>
        {:else}
          <button onclick="{button.target}" style="margin-{buttonsLayout}: 0">{button.title}</button>
        {/if}
      {/each}
    </section>
  </section>
</div>