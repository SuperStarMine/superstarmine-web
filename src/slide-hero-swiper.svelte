<script>
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade, Autoplay } from 'swiper';
  import { sync } from './sync-store.js';
  import Picture from "./picture.svelte";
  import { onMount } from 'svelte';
  export let contents, pairId, isParent, globalSettings;

  let target;
  onMount(() => {
    target = document.querySelector('.swiper-container');
    addEventListener('DOMContentLoaded', () => {
      console.log(target.getBoundingClientRect().y);
      if(target.getBoundingClientRect().y < 0) target.swiper.autoplay.stop();
    });
    new IntersectionObserver((entries, object) => entries.forEach((entry, i) => {
      if(!entry.isIntersecting){
        if(scrollY < 100){
          target.swiper.autoplay.start();
        }else{
          target.swiper.autoplay.stop();
        }
      }
    }),
    {
      rootMargin: '0px 0px -100%'
    }).observe(target);
  });

  const transitionDuration = globalSettings.transitionDuration;
  const slidesPerView = 1.25

  SwiperCore.use([Controller, EffectFade, Autoplay]);

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
    autoplay={{delay: 5000}}
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