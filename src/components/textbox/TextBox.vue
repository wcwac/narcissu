<template>
  <div class="text-box w-screen h-64 fixed bottom-0 grid grid-cols-12 gap-16">
    <div class="text-content col-span-9 text-left pr-24">
      <typed-words :words="text"/>
    </div>
  </div>
</template>

<script lang="ts">
import TypedWords from '../animation/TypedWords.vue';
import { PropType } from 'vue';

export default {
  name: 'Home',
  components: {
    TypedWords,
  },
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      typedObj: null,
    };
  },
};
</script>

<style>
.text-box {
  background: black;
  position: relative;
  left: 180px;
  top: 358px;
  height: 200px;
  width: 600px;
  /* border: none; */
}

.text-name {
  color: gray;
  font-size: 2rem;
}
.text-content {
  color: white;
  font-size: 1.5rem;
  margin-top: 0.3rem;
}
</style>
