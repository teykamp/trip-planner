<script setup lang="ts">
import type { Activity } from "@/types";
import { computed } from "vue";

const props = defineProps({
  activity: Object as Activity,
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const computePeopleString = computed(() => {
    const interestedPeople = props.activity.interestedPeople.length;
    return interestedPeople === 1
      ? "person"
      : "people";
})
</script>

<template>
  <h2 class="text-xl font-semibold text-accent">{{ activity.title }}</h2>
  <p class="text-sm text-space-200 mb-1">
    {{ formatDate(activity.dateStart) }} →
    {{ formatDate(activity.dateEnd) }}
  </p>
  <p class="mb-4 text-space-100">{{ activity.description }}</p>

  <div class="flex gap-3 mb-2">
    <div
      v-for="(count, emoji) in activity.reactions"
      :key="emoji"
      class="flex items-center gap-1 text-lg"
    >
      <span>{{ emoji }}</span>
      <span class="text-sm text-space-300">({{ count }})</span>
    </div>
  </div>

  <p class="text-xs text-space-400">
    Interested: {{ activity.interestedPeople.length }} {{ computePeopleString }}
  </p>
</template>
