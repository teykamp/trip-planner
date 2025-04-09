<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { computed, ref, onMounted } from "vue";
import type { Activity } from "@/types";

const props = defineProps<{
  activity: Activity;
}>();

const storageKey = computed(
  () => `activity-reaction-${props.activity.title}-${props.activity.dateStart}`
);
const userReaction = useLocalStorage(storageKey.value, null);
const showEmojiOptions = ref(false);
const emojiOptions = ["👍", "❤️", "🎉", "🚀", "👏", "😄", "🤔", "👀", "🔥"];

const selectEmoji = (emoji: string) => {
  if (userReaction.value === emoji) {
    userReaction.value = null;
    if (props.activity.reactions[emoji] && props.activity.reactions[emoji] > 0) {
      props.activity.reactions[emoji] -= 1;
      if (props.activity.reactions[emoji] === 0) {
        delete props.activity.reactions[emoji];
      }
    }
  } else {
    props.activity.reactions[emoji] = (props.activity.reactions[emoji] || 0) + 1;

    if (userReaction.value) {
      if (props.activity.reactions[userReaction.value] && props.activity.reactions[userReaction.value] > 0) {
        props.activity.reactions[userReaction.value] -= 1;
        if (props.activity.reactions[userReaction.value] === 0) {
          delete props.activity.reactions[userReaction.value];
        }
      }
    }
    userReaction.value = emoji;
  }
};


const isEmojiInReactions = (emoji: string) => {
  return Object.keys(props.activity.reactions).includes(
    emoji || userReaction.value
  );
};

const hasReactions = computed(() => {
  return (
    Object.keys(props.activity.reactions).length > 0 ||
    userReaction.value !== null
  );
});
</script>

<template>
  <div
    class="flex mb-2"
    @mouseenter="showEmojiOptions = true"
    @mouseleave="showEmojiOptions = false"
  >
    <div v-if="hasReactions" class="flex flex-wrap gap-3 mb-2 mr-2">
      <div
        v-for="(count, emoji) in activity.reactions"
        :key="emoji"
        class="flex items-center gap-1 py-1 cursor-pointer hover:bg-space-800"
        @click="selectEmoji(emoji)"
      >
        <span class="text-lg" :class="{ underline: userReaction === emoji }">{{
          emoji
        }}</span>
        <span class="text-sm text-space-300">{{ count }}</span>
      </div>
    </div>
    <div v-else-if="!showEmojiOptions" class="flex items-center gap-1 mb-2">
      <span class="text-sm pt-1 text-space-400 cursor-pointer"
        >Add reaction</span
      >
    </div>
    <div v-if="showEmojiOptions" class="flex gap-2 mt-1">
      <div
        v-for="emoji in emojiOptions.filter((e) => !isEmojiInReactions(e))"
        :key="emoji"
        @click="selectEmoji(emoji)"
        class="text-lg opacity-50 hover:opacity-100 cursor-pointer px-1 hover:bg-space-800 transition-opacity"
      >
        {{ emoji }}
      </div>
    </div>
  </div>
</template>
