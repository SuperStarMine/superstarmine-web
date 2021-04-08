<script>
  import Cframe from "./common-frame.svelte";
  import Button from "./button.svelte";
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade } from 'swiper';
  import { sync } from './sync-store.js';
  export let pairId, isParent, globalSettings, contents;
  let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
  let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
  let imageSizes = contents.imageSizes || globalSettings.imageSizes;

  const transitionDuration = globalSettings.transitionDuration;

  let realIndex = 0;
  addEventListener('slide', e => {realIndex = e.detail.realIndex});

  SwiperCore.use([Controller, EffectFade]);

  let controlledSwiper = null;
  const setControlledSwiper = e => {
      const [swiper] = e.detail;
      $sync.controlledSwiper = null
      // set Controller swiper instance
      setTimeout(() => {
        controlledSwiper = swiper;
        $sync.controlledSwiper = controlledSwiper;
        dispatchEvent(new CustomEvent('controllee_load', {detail: pairId}))
      }, 100);
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
    effect='fade'
    fadeEffect={{crossFade: true}}
    on:swiper={setControlledSwiper}
    controller={{ control: controlledSwiper ? controlledSwiper : null }}
  >
    {#each contents.articles as article}
      <SwiperSlide>
        <article>
          {#if Array.isArray(article.description)}
            {#each article.description as p}
              <p>{p}</p>
            {/each}
          {:else}
            {article.description}
          {/if}
        </article>
        <div class="buttons">
          {#each article.buttons as button}
            <Button target="{button.target}">
              {#if Array.isArray(button.title)}
                {#each button.title as title}
                  <span class="break-scope">{title}</span>
                {/each}
              {:else}
                {button.title}
              {/if}
            </Button>
          {/each}
        </div>
      </SwiperSlide>
    {/each}
  </Swiper>
</Cframe>

<style lang="stylus">
  .buttons
    display flex
    justify-content center
    align-items center
</style>