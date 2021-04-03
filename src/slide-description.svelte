<script>
  import Cframe from "./common-frame.svelte";
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller } from 'swiper/core';
  import { EffectFade } from 'swiper';
  import { onMount } from 'svelte';
  import { sync } from './sync-store.js';
  export let pairId, isParent, globalSettings, contents;
  let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  let imageSizes = contents.imageSizes || globalSettings.imageSizes;

  const transitionDuration = globalSettings.transitionDuration;

  let realIndex = 0;
  addEventListener('slide', e => {realIndex = e.detail.realIndex});

  SwiperCore.use([Controller]);
  const setControlledSwiper = e => {
      const [swiper] = e.detail;
      $sync.controlledSwiper = null
      // set Controller swiper instance
      setTimeout(() => {
        $sync.controlledSwiper = swiper;
      });
  };
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<Cframe title={contents.articles[realIndex].title} subtitle={contents.articles[realIndex].subtitle} themeColor={contents.articles[realIndex].themeColor}>
  <Swiper
    allowSlideNext={false}
    allowSlidePrev={false}
    allowTouchMove={false}
    autoHeight={true}
    spaceBetween={0}
    slidesPerView={1}
    speed={transitionDuration}
    loop={true}
    loopAdditionalSlides={3}
    on:swiper={setControlledSwiper}
  >
    {#each contents.articles as article}
      <SwiperSlide>
        {#if Array.isArray(article.description)}
          {#each article.description as p}
            <p>{p}</p>
          {/each}
        {:else}
          {article.description}
        {/if}
      </SwiperSlide>
    {/each}
  </Swiper>
</Cframe>

<style lang="stylus">
</style>