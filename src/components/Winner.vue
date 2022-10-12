<template>
  <div ref="parentElm" class="position-relative pt-5 parent" v-if="winner">
    <div
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
      <span class="winnerName">{{ winner.name }}</span>
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
</template>

<script>
import gsap from "gsap";
import { ref, onMounted } from "vue";
export default {
  props: ["winner", "send"],
  setup(props) {
    const TIME_AMOUNT_VIEWING_WINNER = 4000;

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

    const parentElm = ref(null);

    const onCompleteEndAnimation = () => {
      console.log("send FINISH_WINNER from Winner");
      props.send("FINISH_WINNER");
    };

    const onCompleteStartAnimation = () => {
      setTimeout(() => {
        console.log("leaving Winner Component");
        scoreUnMount(parentElm.value);
      }, TIME_AMOUNT_VIEWING_WINNER);
    };

    const scoreMount = (el) => {
      const t1 = gsap.timeline({
        onComplete: onCompleteStartAnimation,
      });
      t1.from(el, {
        y: -1000,
        duration: 0.5,
        ease: "linear",
      });
    };

    const scoreUnMount = (el) => {
      const t2 = gsap.timeline({
        onComplete: onCompleteEndAnimation,
      });

      t2.to(el, {
        y: 2000,
        duration: 0.5,
        ease: "linear",
      });
    };

    onMounted(() => {
      console.log("entering Winner Component");
      scoreMount(parentElm.value);
    });

    return { gameImgBeforeEnter, gameImgEnter, parentElm };
  },
};
</script>

<style scoped>
.parent {
  font-family: "CairoSemiBold";
}
.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
}

.toggle-enter-to,
.toggle-leave-from {
  opacity: 1;
}

.toggle-enter-active,
.toggle-leave-active {
  transition: opacity 0.5s ease-in;
}

.img-icon {
  top: 50vh;
  right: 50vw;
  transform: translateX(50%) translateY(-50%);
  height: 50px;
  width: 50px;
}
.winner-row {
  position: absolute;
  top: 50vh;
  right: 50vw;
  transform: translateX(50%) translateY(-50%);
  padding-left: 60px;
  padding-right: 60px;
  z-index: 1000;
}
</style>
