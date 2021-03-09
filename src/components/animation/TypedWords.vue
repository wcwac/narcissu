<template>
  <div>
    <span>{{ keeptext }}</span>
    <span class="typed-words"></span>
  </div>
</template>

<script>
import Typed from "typed.js";
export default {
  props: {
    words: {
      type: String,
      default: "",
    },
    keep: {
      type: Boolean,
      default: false,
    },
    typeSpeed: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      typedObj: null,
      keeptext: "",
      lasttext: "",
    };
  },
  methods: {
    initTypedJs() {
      if (this.keep) {
        this.keeptext += this.lasttext;
      } else {
        this.keeptext = "";
      }
      this.typedObj = new Typed(".typed-words", {
        strings: [this.words],
        typeSpeed: this.typeSpeed,
        cursorChar: "▼",
      });
      this.lasttext = this.words;
    },
  },
  watch: {
    words() {
      if (this.typedObj) {
        this.typedObj.destroy();
      }
      this.initTypedJs();
    },
    clear() {
      if (this.clear) {
        this.keeptext = "";
        this.clear = false;
      }
    },
  },
};
</script>

<style>
.typed-cursor {
  position: absolute;
  right: 3rem;
  bottom: 1.5rem;
}
</style>
