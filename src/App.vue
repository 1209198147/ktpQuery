<template>
  <div id="app">
    <!-- <course-view></course-view> -->
    <!-- <login-view></login-view> -->
     <router-view></router-view>
  </div>
</template>

<script>
// import CourseView from './views/ktp/CourseView.vue'
// import LoginView from './views/ktp/LoginView.vue'

export default {
  // components: { LoginView },
}
const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}
</script>

<style>
</style>
