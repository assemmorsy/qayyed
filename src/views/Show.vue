<template>
  <div
    v-if="state && state.show"
    class="position-relative text-center h-100 w-100"
  >
    <Winner
      v-if="!state.isChanged && showWinner"
      :winnerName="state[winner].name"
    />
    <DetailedScore
      v-if="state.isChanged && !showWinner"
      :state="state"
      :total="total"
    />
    <Score
      v-if="!state.isChanged && !showWinner"
      :playerOneName="state.playerOne.name"
      :playerTwoName="state.playerTwo.name"
      :playerOneTotalScore="total.playerOne"
      :playerTwoTotalScore="total.playerTwo"
    />
  </div>
</template>

<script>
import { computed, watchEffect, ref } from "vue";
import getDocument from "@/composables/getDocument";
import Score from "@/components/Score.vue";
import Winner from "@/components/Winner.vue";
import DetailedScore from "@/components/DetailedScore.vue";

export default {
  setup() {
    const { error, document: state } = getDocument("game", "1");
    const showWinner = ref(false);
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

    watchEffect(() => {
      if (state.value) {
        if (
          (winner.value === "playerOne" || winner.value === "playerTwo") &&
          !state.value.isChanged
        ) {
          showWinner.value = true;
          setTimeout(() => {
            showWinner.value = false;
          }, 6500);
        }
      }
    });

    return {
      error,
      state,
      showWinner,
      winner,
      total,
    };
  },
  components: { Score, Winner, DetailedScore },
};
</script>

<style scoped>
* {
  background-color: rgba(0, 177, 64);
  height: 1080px;
  width: 1920px;
}
</style>
