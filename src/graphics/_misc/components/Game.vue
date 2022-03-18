<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="run"
        :key="`${run.game}${run.category}`"
        class="Flex"
        :style="{ position: 'absolute', 'flex-direction': 'column' }"
      >
        <div
          v-if="run"
          :style="{ 'font-size': `${1.15 * scale}em`, 'white-space': 'normal' }"
		  id="game"
        >
          {{ run.game }}
        </div>
        <div
          v-if="run"
          :style="{ 'font-size': `${1.1 * scale}em`, color: '#cccccc' }"
		  id="category"
        >
          {{ run.category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
    import fitty from 'fitty'

    export default {
        name: 'Game',
        props: {
            scale: {
                default: 1,
                type: Number
            },
            run: {
                default: undefined,
                type: Object
            }
        },
        data() {
            return {
                $_fittyGame: undefined,
                $_fittyInfo: undefined,
            }
        },
        watch: {
            run: {
                handler: function () {
            setTimeout(() => {
                this.fitText()
            }, 200)
                },
                immediate: true,
                deep: true,
            },
        },
        methods: {
            fitText() {
                this.$data.$_fittyGame = fitty('#game', {
                    minSize: 1,
                    maxSize: 28,
                })
                this.$data.$_fittyInfo = fitty('#category', {
                    minSize: 1,
                    maxSize: 20,
                })
            },
        },
        mounted() {
            setTimeout(() => {
                this.fitText()
            }, 200)
        },
    }
</script>
