<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Activity } from "@/types/Activity";
import ActivityCard from "./Activity.vue";

const activities = ref<Activity[]>([]);

onMounted(async () => {
  try {
    const response = await fetch("https://trip-planner-back-end.vercel.app/activities", {
    });
    const data = await response.json();

    data.sort((a: Activity, b: Activity) => {
      return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
    });

    activities.value = data;
  } catch (err) {
    console.error("Failed to load activities:", err);
  }
});
</script>

<template>
  <div class="space-y-8 overflow-auto">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="bg-space-800 rounded-xl"
    >
      <ActivityCard :activity="activity" />
      <hr
        v-if="index < activities.length - 1"
        class="h-px bg-gray-200 border-0 dark:bg-gray-700 my-6"
      />
    </div>
  </div>
</template>
