<template>
  <div
    id="GenericMessage"
    :style="{ fontSize: '48px' }"
    v-html="normalisedData.msg"
  ></div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';

  const props = defineProps({
    data: { type: Object, default: { msg: '', time: 25 } },
  });

  const emit = defineEmits(['end']);

  const normalisedData = computed(() => {
    return {
      msg: '',
      size: 50,
      time: 20,
      ...props.data,
    };
  });

  onMounted(() => {
    console.log('GenericMessage: Mounted');
    setTimeout(() => {
      emit('end');
      console.log('GenericMessage: ended');
    }, normalisedData.value.time * 1000);
  });
</script>
