<template>
  <div
    v-if="state && state.show"
    class="position-relative text-center h-100 w-100"
  >
    <div
      v-if="!state.isChanged && winner && showWinner"
      class="position-relative t-5"
    >
      <!-- <transition appear name="switch" mode="out-in"> -->
      <div
        v-if="showWinner"
        class="winner-row fs-1 bg-warning bg-gradient text-dark pt-2 pb-3 rounded-5 border border-2 border-light"
      >
        <img
          style="height: 40px; width: 40px"
          :src="require(`@/assets/images/1.svg`)"
        />
        <img
          class="mx-2"
          style="height: 40px; width: 40px"
          :src="require(`@/assets/images/2.svg`)"
        />
        الفائز :
        <span class="winnerName">{{ state[winner].name }}</span>
        <img
          class="mx-3"
          style="height: 40px; width: 40px"
          :src="require(`@/assets/images/3.svg`)"
        />
        <img
          style="height: 40px; width: 40px"
          :src="require(`@/assets/images/4.svg`)"
        />
      </div>
      <!-- </transition> -->
      <div class="images">
        <transition-group
          appear
          @before-enter="gameImgBeforeEnter"
          @enter="gameImgEnter"
        >
          <template v-for="x in [...Array(99).keys()]" :key="x">
            <img
              class="img-icon position-absolute"
              :src="require(`@/assets/images/${(x % 4) + 1}.svg`)"
              :data-indexgame="x"
            />
          </template>
        </transition-group>
      </div>
    </div>

    <div v-else>
      <transition appear name="switch" mode="out-in">
        <div
          v-if="!state.isChanged && !showWinner"
          class="row mt-5 justify-content-between w-100"
        >
          <div
            class="position-relative col col-2 fs-1 bg-dark bg-gradient ms-5 text-light pe-5 pt-2 pb-3 rounded-5 border border-2 border-light"
          >
            {{ state.playerOne.name }}
            <transition
              appear
              @before-enter="totalScoreBeforeEnter"
              @enter="totalScoreEnter"
              @after-leave="totalScoreBeforeEnter"
            >
              <div
                data-dir="-1"
                class="position-absolute top-50 start-100 border score-one border-2 border-light rounded-4"
              ></div>
            </transition>
            <div
              class="cairo position-absolute top-0 start-100 translate-middle-x totalScoreOne text-dark"
            >
              {{ total.playerOne }}
            </div>
          </div>

          <div
            class="position-relative col col-2 fs-1 bg-dark bg-gradient me-5 text-light ps-5 pt-2 pb-3 rounded-5 border border-2 border-light"
          >
            <transition
              appear
              @before-enter="totalScoreBeforeEnter"
              @enter="totalScoreEnter"
              @after-leave="totalScoreBeforeEnter"
            >
              <div
                data-dir="1"
                class="position-absolute top-50 start-0 score-two border border-2 border-light rounded-4"
              ></div>
            </transition>
            {{ state.playerTwo.name }}

            <div
              class="position-absolute top-0 start-0 translate-middle-x cairo totalScoreTwo text-dark"
            >
              {{ total.playerTwo }}
            </div>
          </div>
        </div>
        <div v-else-if="state.isChanged">
          <div
            class="position-relative row mt-5 justify-content-center mx-auto"
          >
            <div
              class="col col-3 bg-grad fs-1 text-light pe-5 pt-2 rounded-5 border border-2 border-light"
            >
              {{ state.playerOne.name }}
            </div>

            <div
              class="position-absolute top-50 start-50 translate-middle fs-1 pt-4 circle bg-dark bg.gradient text-light rounded-circle border border-2 border-light"
            >
              VS
            </div>
            <div
              class="col col-3 bg-grad-reversed fs-1 text-light ps-5 py-2 rounded-5 border border-2 border-light"
            >
              {{ state.playerTwo.name }}
            </div>
          </div>
          <div class="row mt-4 justify-content-center">
            <transition-group
              tag="div"
              appear
              class="col col-3"
              @before-enter="scoreBeforeEnter"
              @enter="scoreEnter"
            >
              <p
                class="fs-2 text-light cairo m-0 p-0"
                v-for="(score, index) in state.playerOne.scores"
                :key="index"
                :data-index="index"
              >
                {{ score }}
              </p>
            </transition-group>
            <transition-group
              tag="div"
              appear
              class="col col-3"
              @before-enter="scoreBeforeEnter"
              @enter="scoreEnter"
            >
              <p
                class="fs-2 text-light cairo m-0 p-0"
                v-for="(score, index) in state.playerTwo.scores"
                :key="index"
                :data-index="index"
              >
                {{ score }}
              </p>
            </transition-group>
          </div>
          <div
            class="row mt-3 justify-content-center"
            v-if="total.playerOne > 0 || total.playerTwo > 0"
          >
            <div class="col col-3">
              <div class="row justify-content-center">
                <transition
                  appear
                  @before-enter="totalScoreBoxBeforeEnter"
                  @enter="totalScoreBoxEnter"
                  @after-enter="totalScoreBoxBeforeEnter"
                >
                  <div
                    class="col col-6 fs-2 bg-grad cairo text-light border border-2 border-light"
                  >
                    {{ total.playerOne }}
                  </div>
                </transition>
              </div>
            </div>

            <div class="col col-3">
              <div class="row justify-content-center">
                <transition
                  appear
                  @before-enter="totalScoreBoxBeforeEnter"
                  @enter="totalScoreBoxEnter"
                  @after-enter="totalScoreBoxBeforeEnter"
                >
                  <div
                    class="col col-6 fs-2 bg-grad-reversed cairo text-light border border-2 border-light"
                  >
                    {{ total.playerTwo }}
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, watchEffect, ref } from "vue";
import getDocument from "@/composables/getDocument";
import gsap from "gsap";
export default {
  setup() {
    const { error, document: state } = getDocument("game", "1");
    const showWinner = ref(false);
    const WiNNING_SCORE = 152;

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
        total.value.playerOne < WiNNING_SCORE &&
        total.value.playerTwo < WiNNING_SCORE
      ) {
        return null;
      } else if (
        total.value.playerOne >= WiNNING_SCORE ||
        total.value.playerTwo >= WiNNING_SCORE
      ) {
        if (total.value.playerOne === total.value.playerTwo) return null;
        else {
          if (total.value.playerOne > total.value.playerTwo) return "playerOne";
          else {
            return "playerTwo";
          }
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

    const totalScoreBeforeEnter = (el) => {
      el.style.transform = ` translate(50% , -60px) skewX(${
        parseInt(el.dataset.dir) * 20
      }deg)`;
    };

    const totalScoreEnter = (el) => {
      gsap.to(el, {
        duration: 1,
        y: "-50%",
        x: "50%",
        ease: "bounce.out",
      });
    };

    const gameImgBeforeEnter = (el) => {
      el.opacity = 1;
    };
    const gameImgEnter = (el) => {
      gsap.to(el, {
        duration: 2,
        opacity: 0,
        y: `${Math.floor((Math.random() - 0.5) * 1000)}`,
        x: `${Math.floor((Math.random() - 0.5) * 1000)}`,
        delay: parseInt(el.dataset.indexgame) * 0.05,
        rotateZ: `${Math.floor(Math.random() * 360)}`,
      });
    };

    const scoreBeforeEnter = (el) => {
      el.style.transform = `translateY(1000px)`;
      el.opacity = 0;
    };

    const scoreEnter = (el) => {
      gsap.to(el, {
        duration: 0.2,
        y: "0",
        x: "0",
        ease: "power1",
        opacity: 1,
        delay: 0.5,
        // + parseInt(el.dataset.index) * 0.2,
      });
    };

    const totalScoreBoxBeforeEnter = (el) => {
      el.style.transform = `translateY(1000px)`;
      el.opacity = 0;
    };

    const totalScoreBoxEnter = (el) => {
      gsap.to(el, {
        duration: 0.5,
        y: "0",
        ease: "bounce.out",
        opacity: 1,
        delay: 0.5,
        // + state.value.playerOne.scores.length * 0.2,
      });
    };

    return {
      error,
      state,
      showWinner,
      gameImgEnter,
      gameImgBeforeEnter,
      totalScoreBoxBeforeEnter,
      totalScoreBoxEnter,
      scoreBeforeEnter,
      scoreEnter,
      winner,
      total,
      totalScoreBeforeEnter,
      totalScoreEnter,
    };
  },
};
</script>

<style scoped>
.winner-row {
  position: absolute;
  top: 50vh;
  right: 50vw;
  transform: translateX(50%) translateY(-50%);
  padding-left: 60px;
  padding-right: 60px;
  z-index: 1000;
}

.img-icon {
  top: 50vh;
  right: 50vw;
  transform: translateX(50%) translateY(-50%);
  height: 50px;
  width: 50px;
}
.winnerName {
}
* {
  background-color: rgba(0, 0, 0, 0);
}

.circle {
  height: 120px !important;
  width: 120px !important;
}
.line {
  margin: 10vh 0px;
  padding: 35vh 2px;
}

.bg-grad {
  background: linear-gradient(-45deg, #e4342a, #f6b033);
}
.bg-grad-reversed {
  background: linear-gradient(-45deg, #f6b033, #e4342a);
}

.cairo {
  font-family: "CairoSemiBold";
}
.score-one,
.score-two {
  height: 100px !important;
  width: 100px !important;
  background-color: #f6b033;
  font-size: larger;
  padding-top: 5px;
}

.skew-0 {
  transform: skewX(-20deg);
}
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.switch-enter-to,
.switch-leave-from {
  opacity: 1;
  transform: translateY(0px);
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.5s ease;
}

html {
  height: 1080px;
  width: 1920px;
}
.totalScoreOne {
  height: 100px;
  width: 100px;
  margin-top: -11px;
  padding-top: 17px;

  /* background-color: aliceblue; */
}
.totalScoreTwo {
  height: 100px;
  width: 100px;
  margin-top: -11px;
  padding-top: 17px;
  /* background-color: aliceblue; */
}
</style>
