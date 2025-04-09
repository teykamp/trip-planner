<script setup lang="ts">
import type { Activity } from "@/types";
import { computed, ref } from "vue";
import Reactions from "./Reactions.vue";
import { useLocalStorage } from "@vueuse/core";

const props = defineProps<{
  activity: Activity;
}>();

const storageKey = computed(
  () => `activity-reaction-${props.activity.dateStart}-${props.activity.title}`
);

const userInterested = useLocalStorage(
  storageKey.value,
  null
);

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

const computePeopleText = computed(() => {
  return props.activity.interestedPeople.length === 0
    ? "No one interested yet"
    : `Interested: ${props.activity.interestedPeople.length} ${computePeopleString.value}`;
});
const showNameInput = ref(false)

const nameInputValue = ref('')

const clickInterested = () => {
  showNameInput.value = true
  nameInput.value?.focus()
}

const submitName = async () => {
  showNameInput.value = false
  userInterested.value = nameInputValue.value

  try {
    const response = await fetch(`http://localhost:3000/activities/interested`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: props.activity.title,
        dateStart: props.activity.dateStart,
        interestedPersonData: nameInputValue.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update reactions on the backend");
    }
  } catch (err) {
    console.error("Error updating activity reactions:", err);
  }

  nameInputValue.value = ''
}
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
    {{ computePeopleText }}
  </p>
  <p v-if="!showNameInput && !userInterested"
    @click="clickInterested"
  class="text-xs text-space-100 italic mt-5 cursor-pointer">I'm interested</p>
  <p v-else-if="userInterested"
    class="text-xs text-space-100 italic mt-5">You're interested!</p>
  <div
    v-else
    class="flex gap-2 pa-3 mt-5 mb-2"
  >
    <input
    v-model="nameInputValue"
      type="text"
      placeholder="Enter your name"
      class="text-xs ml-1 text-space-100 italic"></input>
    <button
      class="bg-accent text-space-100 text-xs px-2 py-1 rounded cursor-pointer"
      @click="submitName"
    >Submit</button>
  </div>
</template>
