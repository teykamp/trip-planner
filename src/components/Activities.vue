<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Activity } from "@/types/Activity";
import ActivityCard from './Activity.vue';

const activities = ref<Activity[]>([]);

onMounted(async () => {
  try {
    const response = await fetch("/data/activities.json");
    console.log("Fetching activities from JSON file...");
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
  <div class="space-y-8">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="bg-space-800 rounded-xl p-6 shadow-md border border-space-600"
    >
      <ActivityCard :activity="activity" />
    </div>
  </div>
</template>
