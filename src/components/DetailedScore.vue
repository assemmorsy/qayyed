<template>
  <Page>
    <div>
      <div class="position-relative row pt-5 justify-content-center mx-auto">
        <div
          class="col col-3 bg-grad fs-1 text-light pe-5 pt-2 rounded-5 border border-2 border-light"
        >
          {{ state.playerOne.name }}
        </div>

        <div
          class="position-absolute translate-middle fs-1 pt-4 circle bg-dark bg.gradient text-light rounded-circle border border-2 border-light"
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
  </Page>
</template>

<script>
import gsap from "gsap";
import Page from "./Page.vue";
export default {
  props: ["state", "total"],
  setup() {
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
      scoreEnter,
      scoreBeforeEnter,
      totalScoreBoxBeforeEnter,
      totalScoreBoxEnter,
    };
  },
  components: { Page },
};
</script>

<style scoped>
.circle {
  height: 120px !important;
  width: 120px !important;
  top: 70%;
  left: 44%;
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
</style>
