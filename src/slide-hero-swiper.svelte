<script>

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import { sync } from './sync-store.js';
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

</script>

<svelte:head>
  {#each imageSrcsets as srcsets}
    <link rel="preload" as="image" href="{contents.imageDirectory || globalSettings.imageDirectory}{contents.articles[0].imageId}@{imageSizes.find(v => v >= window.innerWidth * window.devicePixelRatio * globalSettings.standardWidth / 100) || imageSizes.sort((a, b) => b - a)[0]}w.{supportsWebP ? 'webp' : imageExtensionsShort[safeImageExtensionIndex]}" imagesrcset="{srcsets[supportsWebP && imageExtensionsShort.includes('webp') ? imageExtensionsShort.findIndex(v => v == 'webp') : 0]}" imagesizes="80vw">
  {/each}
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<Swiper
  centeredSlides={true}
  spaceBetween={0}
  slidesPerView={slidesPerView}
  grabCursor={true}
  speed={transitionDuration}
  loop={true}
  on:slideChange=""
  on:swiper={(e) => console.log(e.detail[0])}
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
    height calc(100vw / var(--slidesPerView) / 16  * 9)
</style>