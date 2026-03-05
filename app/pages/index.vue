<script setup lang="ts">
import SongInfoRow from "@/components/SongInfoRow.vue";
import type { Station } from "@/types/station.ts";

import { useStationsStore } from "@/stores/stations";
import { storeToRefs } from "pinia";

const store = useStationsStore();
const { stations } = storeToRefs(store);

const currentStream = ref<Station | null>(null);
const selectedStation = ref<Station | null>(null);
const audio = ref<HTMLAudioElement | null>(null);
const selection = ref();
const modifyDialogOpen = ref(false);

const playStream = (item: Station) => {
  currentStream.value = item;
  if (audio.value) {
    audio.value.src = item.src;
    audio.value.play();
  }
};

const pauseStream = () => {
  if (audio.value) {
    audio.value.pause();
    currentStream.value = null;
  }
};

const handleStationClick = (item: Station) => {
  if (currentStream.value?.id == item.id) {
    pauseStream();
  } else {
    playStream(item);
  }
};

function handleDeleteStation(item: Station) {
  store.remove(item.id);
  stations.value = store.stations;
}

function saveStationToList(item: Station) {
  store.add(item);
  stations.value = store.stations;
}
</script>

<template>
  <div>
    <station-modify-dialog
      v-model="modifyDialogOpen"
      :item="selectedStation"
      @close="modifyDialogOpen = false"
      @delete="handleDeleteStation"
    />
    <div class="sticky-header">
      <song-info-row
        :item="currentStream"
        @play-station="playStream"
        @save-station-to-list="saveStationToList"
      />
    </div>
    <audio ref="audio" />

    <v-container fluid class="pa-1">
      <v-item-group v-model="selection">
        <div class="station-grid">
          <div
            v-for="(item, index) in stations"
            :key="index"
            class="station-item bg-grey-lighten-2 rounded-lg cursor-pointer"
            @click="handleStationClick(item)"
            @click.right="
              selectedStation = item;
              modifyDialogOpen = true;
            "
          >
            <v-item v-if="item.logo !== ''" v-slot="{ isSelected, toggle }">
              <v-img
                :src="item.logo"
                aspect-ratio="1"
                class="text-right ma-2 rounded-lg left-0"
                @click="toggle"
              >
                <v-icon v-if="isSelected" size="36" color="primary">
                  mdi-play-circle
                </v-icon>
              </v-img>
            </v-item>

            <v-item v-else v-slot="{ isSelected, toggle }">
              <v-sheet
                aspect-ratio="1"
                class="d-flex align-center justify-center ma-2 rounded-lg"
                @click="toggle"
              >
                <span style="font-size: 16px">{{ item.name }}</span>

                <v-icon
                  v-if="isSelected"
                  size="36"
                  color="primary"
                  class="position-absolute"
                >
                  mdi-play-circle
                </v-icon>
              </v-sheet>
            </v-item>
          </div>
        </div>
      </v-item-group>
    </v-container>
  </div>
</template>

<style>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10; /* make sure it stays above grid */
  background: rgb(var(--v-theme-surface)); /* important */
}

.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
}

.station-item {
  width: 100%;
}
</style>
