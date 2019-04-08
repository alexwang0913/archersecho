<!-- =========================================================================================
	File Name: TheFooter.vue
	Description: Footer component
	Component Name: TheFooter
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <span>
      COPYRIGHT @ 2019
      <a
        href="https://themeforest.net/user/pixinvent/portfolio?ref=pixinvent"
        target="_blank"
        rel="nofollow"
      >RDH Concepts LLC</a>, All rights Reserved
    </span>
    <span class="md:flex hidden items-center">
      <span>ArchersEcho</span>
      <feather-icon icon="HeartIcon" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2"/>
    </span>
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String
    }
  }
};
</script>