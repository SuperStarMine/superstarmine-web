<script>
  export let contents, globalSettings;
  import {resolveSrcsets, getSafeImageExtensionIndex} from './pictureUtil.js';
  const imageDirectory = contents.imageDirectory || globalSettings.imageDirectory,
        imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort,
        imageSizes = contents.imageSizes || globalSettings.imageSizes,
        socialConsts = {
          urls: {
            'twitter':'twitter.com',
            'facebook':'facebook.com',
            'note':'note.com',
            'github':'github.com',
            'qiita':'qiita.com'
          }
        }
</script>

<div class="card_container">
  {#each contents.cards as card}
    <div class="card_wrapper">
      <div class="card">
        <div class="upper">
          {#if card.imageId}
            <div class="left">
              <picture>
                {#each imageExtensionsShort as ext, i}
                  <source type="image/{ext}" sizes="100vw" srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, card.imageId)[i]}">
                {/each}
                <img sizes="100vw" srcset="{resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, card.imageId)[getSafeImageExtensionIndex(imageExtensionsShort)]}" alt="画像">
              </picture>
            </div>
          {/if}
          <div class="right {card.imageId ? '' : 'noImage'}">
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
            <a class="social-button {account.name} {card.accounts.length > 2 ? 'iconOnly' : ''}"
            href="https://{socialConsts.urls[account.name]}/{account.id}">
              <img src="{globalSettings.imageDirectory}/{account.name}.svg" alt="{account.name}のアイコン">
              <span class="id">
                {account.id}
              </span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<style lang="stylus">
  .card_container
    width 100%
    display flex
    flex-wrap wrap
  .card_wrapper
    @media (min-aspect-ratio: 16/9)
      width calc(100% / 3 - 2em)
      flex 0 0 calc(100% / 3 - 2em)
      font-size calc(2.5vw / 3)
    width calc(50% - 2em)
    flex 0 0 calc(50% - 2em)
    font-size calc(2.5vw * 0.5)
    @media (max-aspect-ratio: 1/1)
      width 80%
      flex 0 0 80%
      font-size calc(2.5vw * 0.8)
    @media (max-aspect-ratio: 3/4)
      width 100%
      flex 0 0 100%
      font-size: 2.5vw
    margin 0 auto 2em
    position relative
    &:before
      content ""
      display block
      padding-top calc(108 / 179 * 100%)
  .card
    display flex
    flex-direction column
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    background-color white
  .upper
    display: flex
    position: relative
    align-items: center
    height 100%
  .name
    font-size 2em
  .post
    span
      display inline-block
      background-color #e3ecee
      white-space nowrap
      padding .25em .5em
      border-radius 1em
      margin-right 1ch
      margin-top .25em
      font-size 1em
  .logo
    width 3ch
    position: absolute
    bottom 1ch
    right 2ch
  .left
    flex calc(100% / 3 - 2ch) 0 0
    margin-left 2ch
    width calc(100% / 3 - 2ch)
    img
      border-radius 20px 20px 40px 20px
  .right
    width 100%
    margin-left 2ch
    .noImage&
      margin-left 4ch
  .lower
    display: flex
    height: 2.5em
  .social-button
    display: flex
    justify-content: center
    align-items center
    color: white
    width 100%
    height 100%
    img
      height 1em
      width auto
      object-fit fill
  .id
    margin-left 1ch
    .iconOnly &
      display: none
  .iconOnly img
    height 1.3em
  img
    width 100%
    object-fit cover
</style>