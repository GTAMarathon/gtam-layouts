<template>
  <div
    id="MediaBoxMerchAlert"
    :style="{ width: '100%', height: '100%' }"
    v-if="merchInfo && currentItem"
  >
    <transition name="fade" mode="out-in">
      <div
        :style="{
          textShadow: '2px 2px 2px #12222c',
          gap: '20px',
        }"
        class="Flex"
        :key="currentItem.name"
      >
        <img :src="getItemImage(currentItem.name)" />
        <span>
          <b class="highlight">{{ merchInfo.name }}</b> has bought
          <b class="highlight"
            >{{ currentItem.quantity }}x {{ currentItem.name }}</b
          >!
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { MerchItem } from '@gtam-layouts/types/seEvents';
  import { defineProps, defineEmits, watch } from 'vue';
  import { $ref } from 'vue/macros';

  const props = defineProps({
    merchInfo: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['merchEnd', 'end']);
  let currentItem = $ref<MerchItem | null>(null);
  let index = 0;
  let timeout: NodeJS.Timeout;

  function getItemImage(item: string): string {
    const url = new URL(`./merch/${item}.png`, import.meta.url).href;
    if (!url.endsWith('undefined')) {
      return url;
    } else {
      return new URL('./emotes/gtaPOGGERS.png', import.meta.url).href;
    }
  }

  function setNextItem() {
    index++;
    clearTimeout(timeout);
    if (index >= props.merchInfo!.items.length) {
      emit('merchEnd');
    }
    currentItem = props.merchInfo!.items[index];
    timeout = setTimeout(() => {
      setNextItem();
    }, 20000 / props.merchInfo!.items.length);
  }

  watch(
    () => {
      props.merchInfo;
    },
    () => {
      if (props.merchInfo && props.merchInfo.items.length) {
        currentItem = props.merchInfo.items[index];
        timeout = setTimeout(() => {
          setNextItem();
        }, 20000 / props.merchInfo.items.length);
      }
    },
    { immediate: true }
  );
</script>

<style scoped>
  .highlight {
    color: #4fbafe;
  }

  .Flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    text-align: center;
    margin: auto;
  }
</style>
