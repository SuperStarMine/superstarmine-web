<script>

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller } from 'swiper/core';
  import { sync } from './sync-store.js';
  import { onMount } from 'svelte';
  import supportsWebP from 'supports-webp';
  export let contents, pairId, isParent, globalSettings;
  let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  let imageSizes = contents.imageSizes || globalSettings.imageSizes;
  let imageSrcsets = [];
  for(let i = 0; i < contents.articles.length; i++) {
    imageSrcsets[i] = imageExtensionsShort.map(ext => {
      return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${contents.articles[i].imageId}@${size}w.${ext} ${size}w`);
    });
  }

  const transitionDuration = globalSettings.transitionDuration;
  const slidesPerView = 1.2

  SwiperCore.use([Controller]);

  let controlledSwiper = null;
  onMount(() => {
    setTimeout(() => {
      controlledSwiper = $sync.controlledSwiper;
    },50);
  });
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<Swiper
  centeredSlides={true}
  spaceBetween={0}
  slidesPerView={slidesPerView}
  grabCursor={true}
  speed={transitionDuration}
  slideToClickedSlide={true}
  loop={true}
  loopAdditionalSlides={2}
  controller={{ control: controlledSwiper }}
  on:slideChangeTransitionStart={e => window.dispatchEvent(new window.CustomEvent('slide', {detail: e.detail[0][0]}))}
>
  {#each imageSrcsets as src}
    <SwiperSlide>
      <picture>
        {#each imageExtensionsShort as ext, i}
          <source type="image/{ext}" sizes="100vw" srcset="{src[i]}">
        {/each}
        <img sizes="100vw" srcset="{src[safeImageExtensionIndex]}" alt="画像">
      </picture>
    </SwiperSlide>
  {/each}
</Swiper>

<style lang="stylus" style="--slidesPerView: {slidesPerView}">
  picture, img
    width 100%
    vertical-align top
  :global(.swiper-container)
    height calc(100vw / var(--slidesPerView) / 16 * 9)
</style>