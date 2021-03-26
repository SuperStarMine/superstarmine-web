<script>
  import { onMount } from 'svelte';
  export let contents, globalSettings;
  let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  const imageSizes = contents.imageSizes || globalSettings.imageSizes;
  let imageSrcset = imageExtensionsShort.map(ext => {
    return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
  });

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  let header, checkbox;

  const scroll_duration = 400; //ms
  let abort_scroll = false;

  function smoothScroll(time, start_time, origin, destination) {
    if (time == start_time) {
      checkbox.checked = false;
      requestAnimationFrame(time => smoothScroll(time, start_time, origin, destination));
      return;
    }
    if (abort_scroll) {
      abort_scroll = false;
      return;
    }
    scrollTo({
      top: origin + (destination||origin * -1) * easeInOutCubic((time - start_time) / scroll_duration)
    });
    if ((time - start_time) > scroll_duration) return;
    requestAnimationFrame(time => smoothScroll(time, start_time, origin, destination));
  }

  function triggerSmoothScroll(target){
    if(target != 'top'){
      var targetElement = document.getElementById(target);
    }
    requestAnimationFrame(time => smoothScroll(
        time,
        time,
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        target == "top" ? 0 : targetElement.getBoundingClientRect().top - header.clientHeight
      )
    );
  }

  onMount(() => setTimeout(() => document.getElementById('header_button_checkbox').checked = false, 2000));
</script>

<header bind:this={header} title="{window.CSS.supports(`(backdrop-filter:blur(10px)) or (-webkit-backdrop-filter:blur(10px)) or (-moz-backdrop-filter:blur(10px)`) ? "" : "Firefoxをお使いの方はabout:configを開いてbackdrop-filterを有効にすると他のブラウザーと同じ見た目にすることができます。"}" style="--itemsCount: {contents.items.length};">
  <picture on:click={() => triggerSmoothScroll('top')} title="クリックするとページの先頭に戻ります">
    {#each imageExtensionsShort as ext, i}
      <source type="image/{ext}" sizes="30vw" srcset="{imageSrcset[i]}">
    {/each}
    <img class="header_logo" sizes="30vw" srcset="{imageSrcset[safeImageExtensionIndex]}" alt="画像">
  </picture>
  <input type="checkbox" class="ui_button header_button_checkbox" checked name="header_button_checkbox" id="header_button_checkbox" bind:this={checkbox}>
  <label for="header_button_checkbox" class="header_button" title="クリックするとナビゲーションを開閉できます">
    <svg class="header_button_svg" viewbox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
    </svg>
  </label>
  <nav class="header_navigation">
    <label for="header_button_checkbox" class="header_navigation_list_items header_navigation_title">
      <h3 class="header_navigation_title"><span class="break-scope">ナビゲーション</span>を<span class="break-scope">閉じる</span></h3>
    </label>
    {#each contents.items as item}
      <div class="header_navigation_list_items" on:click={() => triggerSmoothScroll(item.id)}>{item.label}</div>
    {/each}
    <div class="header_button_dummy">
      <svg class="header_button_svg" viewbox="0 0 24 24" fill="white">
      </svg>
    </div>
  </nav>
</header>

<style lang="stylus">
:root
  --base-size calc(7vh + env(safe-area-inset-top))
  --base-size-vw 1.2vw
  --navigation-width 70vw
  --ui-bg rgba(255,255,255,0.7)
  @supports not ((backdrop-filter blur(10px)) or (-webkit-backdrop-filter blur(10px)) or (-moz-backdrop-filter blur(10px)))
    --ui-bg #fffe
  --ui-bg-hover #fff
  --ui-bg-focus #333
  --ui-over-text-color #000
  --ui-over-bg #333
  --ui-over-bg-hover #888
  --ui-over-text-hover-color #000
  --ui-text-color #FFF
  --ui-text-hover-color #000

vendor(prop, args)
  {prop} args
  -webkit-{prop} args
  -moz-{prop} args

vendorarg(prop, arg)
  {prop} arg
  {prop} -webkit-+arg
  {prop} -moz-+arg

:global(main)
  margin-top: var(--base-size)

.break-scope
  display inline-block
  white-space nowrap

header
  position fixed
  top 0
  display flex
  align-items center
  justify-content space-between
  width 100vw
  padding calc(var(--base-size) / 6) calc(var(--base-size) / 2 + env(safe-area-inset-right)) calc(var(--base-size) / 6) calc(var(--base-size) / 2 +  env(safe-area-inset-left))
  height var(--base-size)
  box-sizing border-box
  background-color var(--ui-bg)
  color var(--text-color)
  @media (prefers-color-scheme: dark)
    background-color var(--ui-bg)
    color var(--text-color)
  vendor(backdrop-filter, blur(10px))
  z-index 1000

picture img
  height calc(var(--base-size) + env(safe-area-inset-top) - (var(--base-size) / 3))
  background-color #fff0

.header_button
  margin 0
  position fixed
  top 0
  right 0
  z-index 7000
  border none
  box-sizing border-box
  border-radius: calc(var(--base-size) / 6) 0 0 calc(var(--base-size) / 6)
  height var(--base-size)
  display inline-flex
  align-items center
  justify-content center
  background-color #444
  transition-property padding
  transition-duration 200ms
  transition-delay 0ms
  transition-timing-function ease-out
  @media screen and (orientation: landscape)
    &:hover
      background-color #555

.header_button_dummy
  margin 0
  z-index 6000
  border none
  box-sizing border-box
  height var(--base-size)
  display inline-flex
  align-items center
  justify-content center
  background-color var(--ui-over-bg)
  @media screen and (orientation: portrait)
    display none

@css{
  .header_button, .header_button_dummy{
    padding: 0 max(env(safe-area-inset-right), calc(var(--base-size) / 2)) 0 calc(var(--base-size) / 2);
  }
  #header_button_checkbox:checked ~ .header_button{
    padding: 0 calc(var(--base-size) / 2) 0;
  }
}

.header_button_svg
  height 60%
  transform translate(0, -2%)
  z-index 8000
  fill white
  pointer-events none
  animation-name derotate_svg
  animation-duration 200ms
  animation-timing-function ease-out
  animation-delay 200ms
  animation-fill-mode both

.header_button_checkbox
  display none

.header_navigation
  display flex
  width var(--navigation-width)
  z-index 6000
  font-size var(--base-size-vw)
  @media screen and (orientation: portrait)
    flex-direction column
    width 50vw
    z-index 4000
    font-size calc(var(--base-size) / 3)
  position fixed
  top 0
  @media screen and (orientation: portrait)
    height 100vh
  right 0
  background-color transparent
  animation-name fold_navigation
  animation-duration 200ms
  animation-timing-function ease-out
  animation-fill-mode both

.header_navigation_list_items
  display block
  width 100%
  background-color var(--ui-over-bg)
  height var(--base-size)
  line-height var(--base-size)
  @media screen and (orientation: portrait)
    height calc((100vh - var(--base-size)) / var(--itemsCount))
    line-height calc(100vh / var(--itemsCount))
  margin 0
  padding 0
  border none
  text-align center
  color var(--ui-text-color)

  &:last-child
    @media screen and (orientation: landscape)
      padding-right env(safe-area-inset-right)

  &:hover
    background-color var(--ui-over-bg-hover)

  &+&:before
    content ''
    position absolute
    display block
    background-color var(--ui-text-color)
    @media screen and (orientation: landscape)
      width 1px
      top calc(var(--base-size) * 0.1)
      transform translate(-0.5px, 0)
      height calc(var(--base-size) * 0.8)
    @media screen and (orientation: portrait)
      height 1px
      left calc(50vw * 0.05)
      transform translate(0, -0.5px)
      width calc(50vw * 0.9)

  @media screen and (orientation: portrait)
    &+&:nth-child(2):before
      content none

.header_navigation_title
  margin 0
  line-height calc(var(--base-size) / 2)
  font-weight normal
  box-sizing border-box
  @media screen and (orientation: landscape)
    border-radius: calc(var(--base-size) / 6) 0 0 calc(var(--base-size) / 6)
  @media screen and (orientation: portrait)
    line-height var(--base-size)
    height var(--base-size)
    text-align left
    padding-left 1.5ch
    border-bottom solid 1px


#header_button_checkbox:checked ~ .header_navigation
  animation-name expand_navigation
  animation-duration 200ms
  animation-timing-function ease-out
  animation-delay 150ms
  animation-fill-mode both

#header_button_checkbox:checked ~ .header_button > svg
  animation-name rotate_svg
  animation-duration 150ms
  animation-timing-function ease-in
  animation-delay 0ms
  animation-fill-mode both

#header_button_checkbox:checked ~ .header_button
  transition-delay 150ms
  // @media screen and (orientation: landscape)
  //   animation-name expand_button
  //   animation-duration 200ms
  //   animation-timing-function ease-out
  //   animation-delay 150ms
  //   animation-fill-mode both

@keyframes rotate_svg
  0%
    transform rotate(45deg)
  100%
    transform rotate(270deg)

@keyframes derotate_svg
  0%
    transform rotate(270deg)
  100%
    transform rotate(45deg)

@media screen and (orientation: landscape)
  @keyframes expand_button
    0%
      transform translate(0, 0)
    100%
      transform translate(calc(var(--navigation-width) * -1), 0)

  @keyframes fold_button
    0%
      transform translate(calc(var(--navigation-width) * -1), 0)
    100%
      transform translate(0, 0)

  @keyframes expand_navigation
    0%
      transform translate(100%, 0%)
    100%
      transform translate(0%, 0%)

  @keyframes fold_navigation
    0%
      transform translate(0%, 0%)
    100%
      transform translate(100%, 0%)

@media screen and (orientation: portrait)
  @keyframes expand_navigation
    0%
      transform translate(100%, 0%)
    100%
      transform translate(0%, 0%)

  @keyframes fold_navigation
    0%
      transform translate(0%, 0%)
    100%
      transform translate(100%, 0%)
</style>