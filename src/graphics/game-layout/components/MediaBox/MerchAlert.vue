<template>
  <div id="MediaBoxMerchAlert" v-if="data && data.merchInfo && currentItem">
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
          <b class="highlight">{{ data.merchInfo.name }}</b> has bought
          <b class="highlight"
            >{{ currentItem.quantity }}x {{ currentItem.name }}</b
          >!
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import type { MerchQueueItem } from '@gtam-layouts/types';
  import { MerchItem } from '@gtam-layouts/types/seEvents';
  import { defineProps, defineEmits, watch } from 'vue';
  import { $ref } from 'vue/macros';

  const props = defineProps<{
    data: { merchInfo: MerchQueueItem | undefined };
  }>();
  const emit = defineEmits(['merchEnd', 'end']);
  let currentItem = $ref<MerchItem | null>(null);
  let index = 0;
  let timeout: NodeJS.Timeout;

  function getItemImage(item: string): string {
    return new URL(`./merch/${item}.png`, import.meta.url).href;
  }

  function setNextItem() {
    index++;
    clearTimeout(timeout);
    if (index >= props.data.merchInfo!.items.length) {
      emit('merchEnd');
    }
    currentItem = props.data.merchInfo!.items[index];
    timeout = setTimeout(() => {
      setNextItem();
    }, 25000 / props.data.merchInfo!.items.length);
  }

  watch(
    () => {
      props.data.merchInfo;
    },
    () => {
      if (props.data.merchInfo && props.data.merchInfo.items.length) {
        currentItem = props.data.merchInfo.items[index];
        timeout = setTimeout(() => {
          setNextItem();
        }, 25000 / props.data.merchInfo.items.length);
      } else {
        emit('end');
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
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
  }
</style>
