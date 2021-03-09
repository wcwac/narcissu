<template>
  <div
    class="main-div"
    :style="{ backgroundImage: 'url(\'' + encodeURI(bg) + '.webp\')' }"
  >
    <!-- <div > -->
    <div>
      <button @click="cal()">sound is: {{ count }}</button>
      <button @click="bgm.play()">bgm is: {{ count }}</button>
      <text-box :text="text" :keep="keep" />
      <!-- <p class="typing">■　８年后…２００４年　主人公　初夏　■</p>
        <p class="typing">简易中文打字效果，作者：张鑫旭</p> -->
    </div>
  </div>
</template>

<script lang="ts">
import TextBox from "./components/textbox/TextBox.vue";

export default {
  name: "home",
  components: {
    TextBox,
  },
  data() {
    return {
      textlist: "",
      text: "",
      count: 0,
      bg: "/e/b.jpg",
      waiting: 0,
      keep:false
    };
  },
  async mounted() {
    let rawtext = (this.textlist = await fetch("./src/assets/1.txt").then(
      (res) => {
        return res.text();
      }
    ));
    console.log(rawtext);
    this.textlist = rawtext.split("\n");
    this.nextParagraph();
  },
  methods: {
    flash(str) {
      this.text = str;
    },
    cal() {
      if (this.waiting == 1) return;
      let flag = 0;
      while (flag == 0) {
        ++this.count;
        const now = this.textlist[this.count] as string;
        console.log(now);
        if (now == "") continue;
        else if (now.startsWith(";")) continue;
        else if (now.startsWith("mov")) continue;
        else if (now.startsWith("bg")) {
          this.bg = "\\" + /[0-9a-z_\\]+\.[a-z]+/.exec(now);
          setTimeout(() => this.cal(), 1000);
          return;
        } else if (now.startsWith("wait")) {
          this.waiting = 1;
          setTimeout(() => {
            this.waiting = 0;
            this.cal();
          }, parseInt(/[0-9]+/.exec(now).toString()));
          return;
        } else if (now.startsWith("stop")) continue;
        else if (now.startsWith("dwave")) continue;
        else if (now.startsWith("dwavestop")) bgm.stop();
        else if (now.startsWith("stop")) continue;
        if (now.endsWith('\\')||now.endsWith('@')){
          this.flash(now.substring(0,now.length-1));
          this.keep=true;
        }else{
          this.flash(now);
          this.keep=false;
        }
        flag = 1;
      }

    },
  },
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";
import { reactive } from "vue";
import { Howl, Howler } from "howler";
defineProps({
  msg: String,
});
const bgm = new Howl({
  src: ["./src/assets/se0629.ogg"],
});
const sound = new Howl({
  src: ["./src/assets/new_465.ogg"],
});

// !function setScale() {
//   window.addEventListener(
//     "resize",
//     function () {
//       var domW = 1280,
//         domH = 720;
//       var scale = Math.min(window.innerWidth / domW, window.innerHeight / domH);
//       dom.style.transform = "scale(" + scale + ")";
//       state.scale = scale;
//     },
//     false
//   );
// };

!(function resizeScale(id) {
  window.addEventListener(
    "resize",
    function () {
      setScale();
    },
    false
  );
  setScale();
  function setScale() {
    const view = document.getElementById(id);
    view.style.position = "absolute";
    // dom.view.style.width = contentW + "px";
    // dom.view.style.height = contentH + "px";
    view.style.backfaceVisibility = "hidden";
    view.style.transformOrigin = "left top";
    var ratio = Math.min(window.innerWidth / 800, window.innerHeight / 600);
    view.style.transform = `scale(${ratio})`;
    view.style.left = `${(window.innerWidth - 800 * ratio) / 2}px`;
    view.style.top = `${(window.innerHeight - 600 * ratio) / 2}px`;
  }
  return false;
})("app");
</script>



<style scoped>
.main-div {
  background: gray;
  width: 800px;
  height: 600px;
  backface-visibility: hidden;
  transform-origin: left top;
  transform: translateZ(0px);
  cursor: inherit;
  transition: all 1s ease-in-out;
}
</style>