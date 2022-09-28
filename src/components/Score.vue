<template>
  <Page>
    <div class="row pt-5 justify-content-between w-100">
      <div
        class="position-relative col col-2 fs-1 bg-dark bg-gradient height-of-col marginPlayerOneRight text-light pe-5 pt-0 pb-2 rounded-5 border border-2 border-light"
      >
        {{ playerOneName }}
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
          class="cairo position-absolute top-0 start-100 translate-middle-x totalScoreOne text-light"
        >
          {{ playerOneTotalScore }}
        </div>
      </div>

      <div
        class="position-relative col col-2 fs-1 bg-dark bg-gradient height-of-col marginPlayerTwoLeft text-light ps-5 pt-0 pb-2 rounded-5 border border-2 border-light"
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
        {{ playerTwoName }}

        <div
          class="position-absolute top-0 start-0 translate-middle-x cairo totalScoreTwo text-light"
        >
          {{ playerTwoTotalScore }}
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import gsap from "gsap";
import Page from "@/components/Page.vue";
export default {
  components: { Page },
  props: [
    "playerOneName",
    "playerTwoName",
    "playerOneTotalScore",
    "playerTwoTotalScore",
  ],
  setup() {
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

    return { totalScoreBeforeEnter, totalScoreEnter };
  },
};
</script>

<style scoped>
.cairo {
  font-family: "CairoSemiBold";
}

.score-one,
.score-two {
  height: 100px !important;
  width: 100px !important;
  font-size: larger;
  padding-top: 5px;
}
.score-one {
  background-color: #e4342a;
}

.score-two {
  background-color: #f6b033;
}

.totalScoreOne,
.totalScoreTwo {
  height: 100px;
  width: 100px;
  margin-top: -11px;
  padding-top: 15px;
  background-color: rgba(0, 0, 0, 0);
}

.marginPlayerOneRight {
  margin-right: 40px;
}

.marginPlayerTwoLeft {
  margin-left: 20px;
}
.height-of-col {
  height: 4.75rem;
}
</style>
