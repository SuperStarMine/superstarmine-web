<script>
  export let contents, globalSettings;
  import {resolveSrcsets, getSafeImageExtensionIndex} from './pictureUtil.js';
  const imageDirectory = contents.imageDirectory || globalSettings.imageDirectory,
        imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort,
        imageSizes = contents.imageSizes || globalSettings.imageSizes,
        socialColors = {
            'twitter':'#1da1f3',
            'facebook':'#1877f2',
            'note':'#41c8b5',
            'github':'#171516',
            'qiita':'#55c500'
          };
</script>

{#each contents.cards as card}
<div class="card">
  <div class="upper">
    {#if card.imageId != ''}
      <div class="left">
        <picture>
          {#each imageExtensionsShort as ext, i}
            <source type="image/{ext}" sizes="100vw" srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, card.imageId)[i]}">
          {/each}
          <img sizes="100vw" srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, card.imageId)[getSafeImageExtensionIndex(imageExtensionsShort)]}" alt="画像">
        </picture>
      </div>
    {/if}
    <div class="right">
      <div class="name">{card.name}</div>
      <div class="post">
        {#each card.post as post}
          <span>{post}</span>
        {/each}
      </div>
      <div class="logo">
        <picture>
          {#each imageExtensionsShort as ext, i}
            <source type="image/{ext}" sizes="100vw" srcset="{resolveSrcsets(globalSettings.imageDirectory, imageExtensionsShort, imageSizes, contents.logoImageId)[i]}">
          {/each}
          <img sizes="100vw" srcset="{resolveSrcsets(globalSettings.imageDirectory, imageExtensionsShort, imageSizes, contents.logoImageId)[getSafeImageExtensionIndex(imageExtensionsShort)]}" alt="画像">
        </picture>
      </div>
    </div>
  </div>
  <div class="lower">
    {#each card.accounts as account}
      <a class="social-button {card.accounts.length > 1 ? 'iconOnly' : ''}"
      style="--bg: {socialColors[account.name]}" href="https://twitter.com/{account.id}">
        <span class="id">
          {account.id}
        </span>
      </a>
    {/each}
  </div>
</div>
{/each}

<style lang="stylus">
  .card
    background-color white
    margin 0 auto 2em
    @media screen and (orientation: portrait)
      width 100%
      height calc(var(--standardWidth) / 179 * 108)
  .upper
    display: flex
    position: relative
    align-items: center
    height 85%
  .name
    @media screen and (orientation: portrait)
      font-size calc(var(--standardWidth) * 0.85 / 179 * 108 * 0.12)
  .post
    span
      display inline-block
      background-color #e3ecee
      white-space nowrap
      padding .25em .5em
      border-radius 1em
      margin-right 1ch
      margin-top .25em
      @media screen and (orientation: portrait)
        font-size calc(var(--standardWidth) * 0.85 / 179 * 108 * 0.12 * 0.6)
  .logo
    width 7%
    position: absolute
    bottom 1ch
    right 2ch
  .left
    flex calc(100% / 3 - 2ch) 0 0
    margin-left 2ch
    width calc(100% / 3 - 2ch)
    img
      border-radius 20px 20px 40px 20px;
  .right
    width 100%
    margin-left 2ch
  .lower
    display: flex
    height: 15%
  .social-button
    display: flex
    justify-content: center
    align-items center
    color: white
    width 100%
    height 100%
    background-color var(--bg)
  .iconOnly .id
    display: none
  img
    width 100%
    object-fit cover
</style>