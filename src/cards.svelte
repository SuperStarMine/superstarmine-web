<script>
  export let contents, globalSettings, standardWidth;
  import Picture from "./picture.svelte";
  import { onMount } from 'svelte';
  const socialConsts = {
          urls: {
            'twitter':'twitter.com',
            'facebook':'facebook.com',
            'note':'note.com',
            'github':'github.com',
            'qiita':'qiita.com',
            'youtube':'www.youtube.com/c'
          },
          aspectRatios: {
            'twitter':{width: 2499, height: 2032},
            'facebook':{width: 971, height: 965},
            'note':{width: 167, height: 188},
            'github':{width: 362, height: 354},
            'qiita':{width: 1, height: 1},
            'youtube':{width: 44, height: 31}
          }
        };

  let ch2px;
  let ch;
  onMount(() => ch = ch2px.getBoundingClientRect().width);
</script>

<div class="card_container">
  {#each contents.cards as card}
    <div class="card_wrapper">
      <div class="card">
        <div class="upper">
          {#if card.imageId}
            <div class="left">
              <Picture imgClass="card_left-img card_img" {contents} {globalSettings} imageId={card.imageId} sizes="(min-aspect-ratio: 16/9) {standardWidth / 3 / 3}vw, {standardWidth / 2 / 3}vw, (max-aspect-ratio: 1/1) {standardWidth * 0.8 / 3}vw, (max-aspect-ratio: 3/4) {standardWidth / 3}vw" width='1' height='1'/>
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
              <div bind:this={ch2px} style="opacity:0;width:1ch"></div>
              <Picture imgClass="card_img" {contents} {globalSettings} imageDirectory={globalSettings.imageDirectory} imageId={contents.logoImageId} imageSizes={contents.logoImageSizes} sizes="{3 * ch}px" width='{contents.logoAspectRatio.width}' height='{contents.logoAspectRatio.height}'/>
            </div>
          </div>
        </div>
        <div class="lower">
          {#each card.accounts as account}
            <a class="social-button {account.name} {card.accounts.length > 2 ? 'iconOnly' : ''}"
            href="{account.customUrl ? account.customUrl : `https://${socialConsts.urls[account.name]}/${account.id}`}">
              <img src="{globalSettings.imageDirectory}/{account.name == 'youtube' ? 'youtube-white' : account.name}.svg" alt="{account.name}のアイコン" width={socialConsts.aspectRatios[account.name].width} height={socialConsts.aspectRatios[account.name].height}>
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
  :global(.card_left-img)
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
  :global(.card_img)
    width 100%
    height auto
    object-fit cover
  .twitter
    background-color #1da1f3
  .facebook
    background-color #1877f2
  .note
    background-color #41c8b5
  .github
    background-color #171516
  .qiita
    background-color #55C500
  .youtube
    background-color #f00
</style>