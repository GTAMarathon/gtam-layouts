<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="activeRun && activeRun.data"
        :key="`${activeRun.data.category}`"
        class="Flex"
      >
        <div
          v-if="activeRun && activeRun.data"
          :style="{ 'font-size': '1.3em' }"
          ref="category"
        >
          {{ activeRun.data.category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { watch } from 'vue';
  import { $ref } from 'vue/macros';
  import { useReplicant } from 'nodecg-vue-composable';
  import fitty, { FittyInstance } from 'fitty';

  interface Props {
    size: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 64,
  });

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );

  const category = $ref<HTMLDivElement | null>(null);
  let categoryFitty: FittyInstance | undefined = undefined;

  watch(
    () => activeRun?.data,
    () => {
      setTimeout(() => {
        if (category) {
          categoryFitty = fitty(category, {
            maxSize: props.size,
            minSize: 1,
            multiLine: true,
          });
        }
      }, 500);
    },
    { immediate: true }
  );
</script>
