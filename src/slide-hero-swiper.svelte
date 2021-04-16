<script>
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade } from 'swiper';
  import { sync } from './sync-store.js';
  import Picture from "./picture.svelte";
  import { onMount } from 'svelte';
  export let contents, pairId, isParent, globalSettings, standardWidth;

  const transitionDuration = globalSettings.transitionDuration;

  SwiperCore.use([Controller, EffectFade]);

  let controlledSwiper = null;
  addEventListener('controllee_load', () => {
    controlledSwiper = $sync.controlledSwiper
  });
</script>

<svelte:head>
  <link rel="preload" href="/swiper-bundle.min.css" as="style">
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<div class="slide-hero">
  <img class="arrow left" src="/img/arrow.svg" alt="左のスライドへ" width='309.94' height='355.04'>
  <Swiper
    centeredSlides={true}
    spaceBetween={4}
    slidesPerView={'auto'}
    grabCursor={true}
    speed={transitionDuration}
    slideToClickedSlide={true}
    loop={true}
    loopedSlides={contents.articles.length}
    controller={{ control: controlledSwiper }}
    on:slideChangeTransitionStart={e => window.dispatchEvent(new window.CustomEvent('slide', {detail: e.detail[0][0]}))}
  >
    {#each contents.articles as article}
      <SwiperSlide>
        <Picture imgClass="slide-img" sizes="{standardWidth / 16 * 9 / article.aspectRatio.height * article.aspectRatio.width}vw" {contents} {globalSettings} imageId={article.imageId} width={article.aspectRatio.width} height={article.aspectRatio.height}/>
      </SwiperSlide>
    {/each}
  </Swiper>
  <img class="arrow right" src="/img/arrow.svg" alt="右のスライドへ" width='309.94' height='355.04'>
</div>

<style lang="stylus">
  :global(.slide-hero .slide-img)
    width auto
    height calc(var(--standardWidth) / 16 * 9)
    vertical-align top
  :global(.slide-hero .swiper-wrapper)
    width 50%
  :global(.slide-hero .swiper-slide)
    text-align center
    width auto
    // height calc(100vw / var(--slidesPerView) / 16 * 9)
  .slide-hero
    position relative
    &:before, &:after
      content ''
      display block
      width calc((100vw - var(--standardWidth)) / 6)
      height 100%
      position absolute
      top 0
      z-index 2
      pointer-events none
    &:before
      left 0
      background linear-gradient(to right, #2228, transparent)
    &:after
      right 0
      background linear-gradient(to left, #2228, transparent)

    .arrow
      @media screen and (orientation: portrait)
        display none
      position absolute
      top 0
      bottom 0
      margin auto calc((100vw - var(--standardWidth)) / 6)
      z-index 3
      width calc((100vw - var(--standardWidth)) / 6)
      height auto
      pointer-events none
      animation-duration 1s
      animation-timing-function ease-in-out
      animation-fill-mode both
      animation-direction alternate
      animation-iteration-count infinite
      &.left
        left 0
        animation-name swing-left
      &.right
        right 0
        animation-name: swing-right

    @keyframes swing-left
      0%
        transform translateX(calc((100vw - var(--standardWidth)) / 48))
      100%
        transform translateX(calc(((100vw - var(--standardWidth)) / 48) * -1))

    @keyframes swing-right
      0%
        transform scaleX(-1) translateX(calc((100vw - var(--standardWidth)) / 48))
      100%
        transform scaleX(-1) translateX(calc(((100vw - var(--standardWidth)) / 48) * -1))

</style>