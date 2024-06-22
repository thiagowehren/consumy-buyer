<template>
  <nav class="my-4 mx-4">
    <span v-for="(segment, index) in segments" :key="index">
      <span v-if="index !== 0" class="mx-1"> > </span>
      <template v-if="segment.clickable">
        <router-link :to="segment.path" class="text-red">{{ segment.label }}</router-link>
      </template>
      <template v-else>
        <span>{{ segment.label }}</span>
      </template>
    </span>
  </nav>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true
    },
    clickableSegments: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    segments() {
      const paths = this.route.split('/').filter(path => path !== '');
      const segments = [];

      segments.push({ path: '/', label: 'Home', clickable: true });

      let currentPath = '';

      for (let i = 0; i < paths.length; i++) {
        currentPath += `/${paths[i]}`;
        const clickable = this.clickableSegments.includes(i);
        segments.push({
          path: currentPath,
          label: paths[i].replace(/^\w/, c => c.toUpperCase()),
          clickable
        });
      }

      return segments;
    }
  }
};
</script>
