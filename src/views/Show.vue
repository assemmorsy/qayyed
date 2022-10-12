<template>
  <div
    v-if="state && state.show"
    class="position-relative text-center h-100 w-100"
  >
    <component
      :is="COMPS[stateMachine.value].comp"
      v-bind="COMPS[stateMachine.value].props"
    ></component>
  </div>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useMachine } from "@xstate/vue";

import getDocument from "@/composables/getDocument";
import { showMachine } from "@/composables/showMachine";

import Score from "@/components/Score.vue";
import Winner from "@/components/Winner.vue";
import DetailedScore from "@/components/DetailedScore.vue";

export default {
  setup() {
    const { error, document: state } = getDocument("game", "1");
    const WINNING_SCORE = 152;

    const total = computed(() => {
      if (state.value !== null) {
        let playerOne = state.value.playerOne.scores.reduce(
          (s1, s2) => s1 + s2,
          0
        );
        let playerTwo = state.value.playerTwo.scores.reduce(
          (s1, s2) => s1 + s2,
          0
        );
        return { playerOne, playerTwo };
      } else {
        return { playerOne: 0, playerTwo: 0 };
      }
    });

    const winner = computed(() => {
      if (
        total.value.playerOne < WINNING_SCORE &&
        total.value.playerTwo < WINNING_SCORE
      ) {
        return null;
      } else {
        if (total.value.playerOne === total.value.playerTwo) return null;
        else if (total.value.playerOne > total.value.playerTwo)
          return "playerOne";
        else {
          return "playerTwo";
        }
      }
    });
    const hideScore = ref(false);
    const COMPS = computed(() => {
      if (state.value)
        return {
          Score: {
            comp: Score,
            props: {
              playerOneName: state.value.playerOne.name,
              playerTwoName: state.value.playerTwo.name,
              playerOneTotalScore: total.value.playerOne,
              playerTwoTotalScore: total.value.playerTwo,
              hide: hideScore.value,
              send: send,
            },
          },
          DetailedScore: {
            comp: DetailedScore,
            props: {
              state: state.value,
              total: total.value,
              send: send,
              stateMachine: stateMachine.value,
            },
          },
          Winner: {
            comp: Winner,
            props: {
              winner: state.value[winner.value],
              send: send,
            },
          },
        };
    });

    const { state: stateMachine, send } = useMachine(showMachine, {
      guards: {
        hasWinner: () => {
          console.log("checking winner");
          return winner.value !== null;
        },
      },
      actions: {
        showScore: () => {
          hideScore.value = false;
        },
      },
    });

    watch(
      () => [total.value, state.value],
      (newVal, oldVal) => {
        if (
          oldVal[1] !== null &&
          (newVal[0].playerOne > oldVal[0].playerOne ||
            newVal[0].playerTwo > oldVal[0].playerTwo) &&
          stateMachine.value.value === "Score"
        ) {
          console.log("start end transition of the score");
          hideScore.value = true;
        }
      }
    );

    return {
      stateMachine,
      send,
      error,
      state,
      winner,
      total,
      COMPS,
    };
  },
  components: { Score, Winner, DetailedScore },
};
</script>

<style scoped>
* {
  /* background-color: rgba(0, 0, 0,0); */

  background-color: rgba(0, 177, 64);
  height: 1080px;
  width: 1920px;
}
</style>
