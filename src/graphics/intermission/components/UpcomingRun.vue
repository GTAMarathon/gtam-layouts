<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="!runData"
        :key="'over'"
        class="Flex"
        :style="{ 'font-size': '3em' }"
      >
        It's Over 😔
      </div>
      <div
        v-else
        :key="runData.id"
        class="Flex"
      >
        <div :style="{ 'font-size': '2.5em' }" id="game">
          {{ runData.game }}
        </div>
        <div :style="{ 'font-size': '2em' }" id="category">
          {{ runData.category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
    import fitty from 'fitty'

    export default {
        name: 'UpcomingRun',
        props: ['runData'],
        data() {
            return {
                $_fittyGame: undefined,
                $_fittyInfo: undefined,
            }
        },
        watch: {
            runData: {
                handler: function () {
                    setTimeout(() => {
                        this.fitText()
                    })
                },
                immediate: true,
                deep: true,
            },
        },
        methods: {
            fitText() {
                this.$data.$_fittyGame = fitty('#game', {
                    minSize: 1,
                    maxSize: 30,
                })
                this.$data.$_fittyInfo = fitty('#category', {
                    minSize: 1,
                    maxSize: 24,
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

<style scoped>
  .Flex {
    flex-direction: column;
  }
</style>
