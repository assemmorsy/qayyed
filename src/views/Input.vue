<template>
  <div class="container">
    <div
      class="row justify-content-around pt-4 text-center bg-success position-relative"
    >
      <div class="mb-3 col col-5">
        <input
          type="text"
          class="form-control border-0 border-bottom bg-success text-light border-light"
          v-model="state.playerOne.name"
          @blur="updateName"
        />
        <p class="total text-light">
          {{ total.playerOne }}
        </p>
      </div>

      <div class="mb-3 col col-5 justify-content-center">
        <input
          type="text"
          class="form-control border-0 border-bottom bg-success text-light border-light"
          v-model="state.playerTwo.name"
          @blur="updateName"
        />
        <p class="total text-light">
          {{ total.playerTwo }}
        </p>
      </div>

      <div class="position-absolute top-100 start-50 translate-middle">
        <button
          class="btn btn-success qayyed border rounded-circle border-3"
          @click="handleQayyed"
        >
          <i class="bi bi-send icon"></i>
        </button>
      </div>
    </div>
    <transition name="data">
      <div v-if="!winner" class="row justify-content-around text-center pt-3">
        <div class="mb-3 col col-5 justify-content-center">
          <div class="row justify-content-center">
            <div class="col col-6">
              <input
                type="tel"
                class="form-control border-0 shadow p-2"
                v-model="tempScores.playerOne"
                id="playerOne"
                @keypress.prevent="validateNumber"
              />
            </div>
          </div>
        </div>
        <div class="mb-3 col col-5 justify-content-center">
          <div class="row justify-content-center">
            <div class="col col-6">
              <input
                type="tel"
                class="form-control border-0 shadow p-2"
                v-model="tempScores.playerTwo"
                id="playerTwo"
                @keypress.prevent="validateNumber"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="data">
      <div
        v-if="winner"
        class="row justify-content-around text-center pt-5 text-success"
      >
        الفريق الفائز هو فريق ( {{ state[winner].name }} )
      </div>
    </transition>
    <transition name="data">
      <div
        v-if="qayyedError"
        class="row justify-content-around text-center mt-1 text-danger"
      >
        {{ qayyedError }}
      </div>
    </transition>

    <div
      class="row justify-content-around text-center mt-2"
      style="overflow-y: auto; height: 50vh"
    >
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <transition-group name="scores" appear>
            <p v-for="(score, index) in state.playerOne.scores" :key="index">
              {{ score }}
            </p>
          </transition-group>
        </div>
      </div>
      <div class="mb-3 col col-5 justify-content-center">
        <div class="row justify-content-center">
          <transition-group name="scores" appear>
            <p v-for="(score, index) in state.playerTwo.scores" :key="index">
              {{ score }}
            </p>
          </transition-group>
        </div>
      </div>
    </div>

    <div class="row justify-content-center fixed-bottom mb-3">
      <div class="col col-2">
        <button
          class="btn btn-warning qayyed rounded-circle"
          @click="handleBack"
          :disabled="
            !(
              state.playerOne.scores.length > 0 &&
              state.playerTwo.scores.length > 0
            )
          "
        >
          <i class="bi bi-skip-backward icon"></i>
        </button>
      </div>

      <div class="col col-2">
        <button
          class="btn btn-danger qayyed rounded-circle"
          @click="handleDeleteAll"
          v-if="winner"
        >
          <i class="bi bi-trash3 icon"></i>
        </button>
      </div>
      <div class="col col-2">
        <button
          class="btn qayyed rounded-circle"
          :class="state.show ? 'btn-info' : 'btn-success'"
          @click="toggleShow"
        >
          {{ state.show ? "H" : "S" }}
        </button>
      </div>

      <div class="col col-2">
        <button
          class="btn btn-primary qayyed rounded-circle"
          v-if="!logoutLoading"
          @click="handleLogout"
        >
          <i class="bi bi-door-closed icon"></i>
        </button>
        <button class="btn btn-primary qayyed rounded-circle" disabled v-else>
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>

      <div class="row justify-content-center text-center">
        <div class="text-danger">{{ logoutError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import useLogout from "@/composables/useLogout.js";
import useDocument from "@/composables/useDocument";
import getDocument from "@/composables/getDocument";
import { useRouter } from "vue-router";
import { async } from "@firebase/util";
export default {
  setup() {
    const router = useRouter();
    const { error: logoutError, loading: logoutLoading, logout } = useLogout();
    const WiNNING_SCORE = 152;
    const qayyedError = ref(null);
    const { error, isPending, updateDoc } = useDocument("game", "1");
    const { error: getDocError, document } = getDocument("game", "1");

    const tempScores = ref({
      playerOne: "",
      playerTwo: "",
    });
    const state = ref({
      playerOne: {
        name: "لنا",
        scores: [],
      },
      playerTwo: {
        name: "لهم",
        scores: [],
      },
      isChanged: false,
      show: true,
    });

    const total = computed(() => {
      let playerOne = state.value.playerOne.scores.reduce(
        (s1, s2) => s1 + s2,
        0
      );
      let playerTwo = state.value.playerTwo.scores.reduce(
        (s1, s2) => s1 + s2,
        0
      );
      return { playerOne, playerTwo };
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
    const updateName = async () => {
      await updateDoc(state.value);
    };

    const toggleShow = async () => {
      state.value.show = !state.value.show;
      await updateDoc(state.value);
    };
    watchEffect(() => {
      if (document.value) {
        state.value.playerOne = document.value.playerOne;
        state.value.playerTwo = document.value.playerTwo;
        state.value.show = document.value.show;
        state.value.isChanged = document.value.isChanged;
      }
    });

    const handleLogout = async () => {
      await logout();
      if (!logoutError.value) router.push({ name: "login" });
    };
    const handleDeleteAll = async () => {
      state.value.playerOne.scores = [];
      state.value.playerTwo.scores = [];
      state.value.isChanged = false;
      tempScores.value = {
        playerOne: "",
        playerTwo: "",
      };
      qayyedError.value = null;
      await updateDoc(state.value);
    };
    const handleBack = async () => {
      if (
        state.value.playerOne.scores.length > 0 &&
        state.value.playerTwo.scores.length > 0
      ) {
        state.value.playerOne.scores.pop();
        state.value.playerTwo.scores.pop();
        await updateDoc(state.value);
      }
    };
    const validateNumber = (event) => {
      qayyedError.value = null;
      const Numbers = "0123456789".split("");
      if (
        Numbers.includes(event.key) &&
        tempScores.value[event.target.id].length < 3
      ) {
        ["0", "", "-"].includes(tempScores.value[event.target.id])
          ? (tempScores.value[event.target.id] = event.key)
          : (tempScores.value[event.target.id] += event.key);
      }
    };
    let currentTimer = null;

    const handleQayyed = async () => {
      qayyedError.value = null;
      tempScores.value.playerOne === ""
        ? (tempScores.value.playerOne = 0)
        : null;
      tempScores.value.playerTwo === ""
        ? (tempScores.value.playerTwo = 0)
        : null;
      let totalP1, totalP2;
      try {
        totalP1 = parseInt(tempScores.value.playerOne);
        totalP2 = parseInt(tempScores.value.playerTwo);
      } catch (error) {
        console.log(error);
        qayyedError.value = "برجاء ادخال ارقام فقط";
      }

      if (totalP1 <= 300 && totalP2 <= 300 && (totalP1 > 0 || totalP2 > 0)) {
        state.value.playerOne.scores.push(totalP1);
        state.value.playerTwo.scores.push(totalP2);
        tempScores.value.playerOne = "";
        tempScores.value.playerTwo = "";

        if (!state.value.isChanged) {
          state.value.isChanged = true;
          currentTimer = setTimeout(async () => {
            state.value.isChanged = false;
            await updateDoc(state.value);
          }, 6500);
        } else {
          clearTimeout(currentTimer);
          currentTimer = setTimeout(async () => {
            state.value.isChanged = false;
            await updateDoc(state.value);
          }, 4000);
        }
        await updateDoc(state.value);
      } else {
        qayyedError.value = "برجاء ادخال النتيجة اقل من او تساوى 300";
      }
    };
    return {
      toggleShow,
      updateName,
      handleLogout,
      logoutError,
      logoutLoading,
      handleDeleteAll,
      tempScores,
      handleBack,
      validateNumber,
      state,
      total,
      document,
      handleQayyed,
      qayyedError,
      winner,
    };
  },
};
</script>

<style scoped>
.qayyed {
  width: 60px;
  height: 60px;
}
.line {
  background-color: black;
  height: 50vh;
  width: 1px;
}
.icon {
  font-size: 30px;
}

.data-enter-active {
  /* transition: all 2s ease; */
  animation: wabble 0.5s ease;
}
@keyframes wabble {
  0% {
    opacity: 0;
    transform: translateX(-60px);
  }
  50% {
    opacity: 1;
    transform: translateX(0px);
  }
  60% {
    transform: translateX(8px);
  }
  70% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(4px);
  }
  90% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0px);
  }
}
* {
  font-family: "cairoSemiBold";
}

.scores-enter-from {
  opacity: 0;
}
.scores-enter-to {
  opacity: 1;
}
.scores-enter-active {
  transition: opacity 0.7s ease;
}

.scores-leave-from {
  opacity: 1;
}
.scores-leave-to {
  opacity: 0;
}
.scores-leave-active {
  transition: opacity 0.7s ease;
}
</style>
