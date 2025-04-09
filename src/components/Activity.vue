<script setup lang="ts">
import type { Activity } from "@/types";
import { computed, ref } from "vue";
import Reactions from "./Reactions.vue";

const props = defineProps<{
    activity: Activity;
}>();

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
  return interestedPeople === 1 ? "person" : "people";
});

const selectEmoji = (emoji: string) => {
  userReaction.value = emoji;
  showEmojiPicker.value = false;
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};
</script>

<template>
  <h2 class="text-xl font-semibold text-accent">{{ activity.title }}</h2>
  <p class="text-sm text-space-200 mb-1">
    {{ formatDate(activity.dateStart) }} →
    {{ formatDate(activity.dateEnd) }}
  </p>
  <p class="mb-4 text-space-100">{{ activity.description }}</p>

  <Reactions :activity="activity" />

  <p class="text-xs text-space-400">
    Interested: {{ activity.interestedPeople.length }} {{ computePeopleString }}
  </p>
</template>
