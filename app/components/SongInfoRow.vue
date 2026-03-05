<script setup lang="ts">
import { Station } from "@/types/station.ts";
import { getMetadata } from "@/composables/useStations.ts";
import { ref } from "vue";

const props = defineProps({
  item: {
    type: Station,
    default: null,
  },
});

const emit = defineEmits(["playStation", "saveStationToList"]);

const currentSong = ref<string>("");
const openSearchDialog = ref(false);
const refresh = ref(0);

const updateMetadata = async () => {
  if (!props.item) {
    currentSong.value = "";
    return;
  }
  const metadata = await getMetadata(props.item);
  if (metadata != "" || refresh.value >= 5) {
    currentSong.value = metadata;
    refresh.value = 0;
    return;
  }

  refresh.value++;
};

onMounted(() => {
  setInterval(() => updateMetadata(), 2000);
});
</script>

<template>
  <div>
    <station-search-dialog
      v-model="openSearchDialog"
      @close="openSearchDialog = false"
      @play-station="(station) => emit('playStation', station)"
      @save-station-to-list="(station) => emit('saveStationToList', station)"
    />
    <v-row align="center" no-gutters>
      <v-col cols="12" md="10" class="d-flex align-center">
        <v-icon color="primary" class="mr-2"> mdi-music-note-eighth </v-icon>

        <span class="font-weight-bold mr-2">
          {{ item?.name || "Kein Radiosender ausgewählt" }}
        </span>

        <span v-if="item?.name" class="song-title"
          >&nbsp;&nbsp;{{ currentSong }}</span
        >
      </v-col>

      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn
          class="text-capitalize"
          prepend-icon="mdi-magnify"
          rounded="xl"
          color="primary"
          @click="openSearchDialog = true"
        >
          Sendersuche
        </v-btn>
      </v-col>
    </v-row>
    <v-divider style="margin-top: 12px; margin-bottom: 12px" />
  </div>
</template>

<style scoped>
.song-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
}
</style>
