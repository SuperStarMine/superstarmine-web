<script>
  import Cframe from "./common-frame.svelte";
  import Button from "./button.svelte";
  import Yframe from "./youtube-iframe.svelte";
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade } from 'swiper';
  import { sync } from './sync-store.js';
  export let pairId, isParent, globalSettings, contents;
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
        controlledSwiper.updateAutoHeight();
        $sync.controlledSwiper = controlledSwiper;
        dispatchEvent(new CustomEvent('controllee_load', {detail: pairId}))
      }, 100);
  }
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
        <div class="wrapper">
          <div class="left">
            {#if article.slides}
              <Swiper
                centeredSlides={true}
                autoHeight={true}
                spaceBetween={0}
                slidesPerView={1}
                speed={transitionDuration}
                updateOnImagesReady={true}
              >
                {#each article.slides as slide}
                  <SwiperSlide>
                    {#if slide.type == "youtube"}
                      <Yframe {contents} {globalSettings} id={slide.id} />
                    {/if}
                  </SwiperSlide>
                {/each}
              </Swiper>
              {/if}
            {#if article.specs}
              <div class="specs">
                {#if article.specs.times}
                  <div class="times">
                    制作時期：
                    {#each article.specs.times as time}
                      <!-- svelte-ignore component-name-lowercase -->
                      <time datetime="{(time.year ? ("0000"+time.year).slice(-4) : "") + (time.month ? "-" + ("00"+time.month).slice(-2) : "") + (time.day ? "-" + ("00"+time.day).slice(-2) : "")}">
                        {(time.year ? time.year + "年" : "") + (time.month ? time.month + "月" : "") + (time.day ? time.day + "日" : "")}{time.annotation}
                      </time>
                    {/each}
                  </div>
                {/if}
                {#if article.specs.platforms}
                  <div class="platforms">
                    対応プラットフォーム：
                    {#each article.specs.platforms as platform}
                      <div>
                        {platform.name} {platform.version || ""}{platform.orLater ? "以降" : ""}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
          <div class="right">
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
          </div>
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
  .times time
    display block
    margin-left 2ch
  .platforms div
    margin-left 2ch
</style>