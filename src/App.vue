<template>
  <div
    class="main-div"
    :style="{ backgroundImage: 'url(\'' + encodeURI(bg) + '.webp\')' }"
    @click="cal()"
  >
    <!-- <div > -->
    <div>
      <button @click="play()">sound is: {{ count }}</button>
      <button @click="bgm.play()">bgm is: {{ count }}</button>
      <text-box :text="text" />
    </div>
  </div>
</template>

<script lang="ts">
import TextBox from "./components/textbox/TextBox.vue";
import { Howl, Howler } from "howler";

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
      last: false,
      sound: {},
    };
  },
  async mounted() {
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
    let rawtext = (this.textlist = await fetch("./src/assets/1.txt").then(
      (res) => {
        return res.text();
      }
    ));
    console.log(rawtext);
    this.textlist = rawtext.split("\n");
    this.sound = new Map();
    this.cal();
  },
  methods: {
    clearTimer() {
      let i = setTimeout(() => this.cal(), 100000);
      while (i >= 0) {
        clearTimeout(i);
        --i;
      }
    },
    flash(str) {
      this.text = str;
    },
    cal() {
      if (this.waiting == 1) return;
      this.clearTimer();
      let flag = 0;
      while (flag == 0) {
        ++this.count;
        let now = this.textlist[this.count] as string;
        console.log(now);
        if (now == "") continue;
        else if (now.startsWith(";")) continue;
        else if (now.startsWith("mov")) continue;
        else if (now.startsWith("bg")) {
          this.bg = "\\" + /[0-9a-z_\\]+\.[a-z]+/.exec(now);
          setTimeout(() => this.cal(), 1100);
          return;
        } else if (now.startsWith("wait") || now.startsWith("!w")) {
          this.waiting = 1;
          setTimeout(() => {
            this.waiting = 0;
            this.cal();
          }, parseInt(/[0-9]+/.exec(now).toString()));
          return;
        } else if (now.startsWith("!")||now.startsWith("setwindow")||now.startsWith("erasetextwindow")){
          continue;
        }else if (now.startsWith("mp3loop")) {
          this.sound["mp3"] = new Howl({
            src: [/"(.*?)"/.exec(now)[1]],
          });
          this.sound["mp3"].play();
        } else if (now.startsWith("mp3fadeout")) {
          if (this.sound["mp3"]) this.sound["mp3"].stop();
        } else if (now.startsWith("stop")) {
          for (var i in this.sound) {
            i.stop();
          }
          console.log("stop music");
        } else if (now.startsWith("dwavestop")) {
          if (this.sound && this.sound[/[0-9]+/.exec(now).toString()])
            this.sound[/[0-9]+/.exec(now).toString()].stop();
        } else if (now.startsWith("dwave")) {
          let ch = /([0-9]+),"(.*?)"/.exec(now)[1];
          let fi = /([0-9]+),"(.*?)"/.exec(now)[2];
          this.sound[ch] = new Howl({
            src: ["\\" + fi],
          });
          this.sound[ch].play();
        } else if (now.startsWith("stop")) continue;
        else {
          if (this.last) {
            now = "\\" + now;
          }
          now = now.replace("@", "\n");
          if (now.endsWith("\\")) {
            this.flash(now.substring(0, now.length - 1));
            this.last = true;
          }
          // else if (now.endsWith('@')){
          //   this.flash(now.substring(0,now.length-1)+"\n");
          //   this.last=false;
          // }
          else {
            this.flash(now);
            this.last = false;
          }
          flag = 1;
        }
      }
    },
    play() {
      this.sound[5] = new Howl({
        src: ["/w/n001.ogg"],
      });
      this.sound[5].play();
    },
  },
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";
import { reactive } from "vue";
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