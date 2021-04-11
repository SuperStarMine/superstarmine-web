<script>
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade } from 'swiper';
  import { sync } from './sync-store.js';
  import Picture from "./picture.svelte";
  import { onMount } from 'svelte';
  export let contents, pairId, isParent, globalSettings;

  const transitionDuration = globalSettings.transitionDuration;
  const slidesPerView = 1.25

  SwiperCore.use([Controller, EffectFade]);

  let controlledSwiper = null;
  addEventListener('controllee_load', () => {
    controlledSwiper = $sync.controlledSwiper
  });

</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<div class="slide-hero">
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
    style="--slidesPerView: {slidesPerView}"
  >
    {#each contents.articles as article}
      <SwiperSlide>
        <Picture imgClass="slide-img" sizes="{100 / slidesPerView}vw" {contents} {globalSettings} imageId={article.imageId}/>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>

<style lang="stylus">
  :global(.slide-hero .slide-img)
    width auto
    height calc((100vw / var(--slidesPerView)) / 16 * 9)
    vertical-align top
  :global(.slide-hero .swiper-wrapper)
    width 50%
  :global(.slide-hero .swiper-slide)
    text-align center
    width auto
    // height calc(100vw / var(--slidesPerView) / 16 * 9)
</style>