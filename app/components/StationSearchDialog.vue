<script setup lang="ts">
import type { Station } from "~/types/station";

defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const emit = defineEmits(["close", "playStation", "saveStationToList"]);

const query = ref("");
const stations = ref<Station[]>([]);
const loading = ref(false);

const addDialog = ref(false);
const addItem = ref();

function openAddDialog(item: unknown) {
  addItem.value = item;
  addDialog.value = true;
}

async function onSearchClick() {
  loading.value = true;
  const result = await searchStations(query.value);
  stations.value = result.map((station) => {
    const hasFavicon = station.logo && station.logo.trim() !== "";

    return {
      title: station.name,
      subtitle: station.src,
      onClick: () => openAddDialog(station),
      ...(hasFavicon
        ? { prependAvatar: station.logo }
        : { prependIcon: "mdi-music-note-eighth" }),
    };
  });
  loading.value = false;
}
</script>

<template>
  <div>
    <station-add-dialog
      v-model="addDialog"
      :item="addItem"
      @close="addDialog = false"
      @play-station="(station) => emit('playStation', station)"
      @save-station-to-list="(station) => emit('saveStationToList', station)"
    />
    <v-dialog
      max-width="1000"
      min-height="500"
      :model-value="modelValue"
      title="Sendersuche"
      @update:model-value="emit('close')"
    >
      <v-card title="Sendersuche">
        <v-divider />
        <v-card-item>
          <v-row align="center" no-gutters>
            <v-col cols="12" class="mt-2 d-flex align-center">
              <v-text-field
                v-model="query"
                label="Radiosender"
                variant="outlined"
                class="flex-grow-1 mr-2"
                @keyup.enter="onSearchClick()"
              />
              <v-btn
                color="primary"
                rounded="xl"
                class="mb-6 text-capitalize"
                @click="onSearchClick()"
              >
                Suchen
              </v-btn>
            </v-col>
          </v-row>
          <div
            v-if="loading"
            class="text-center flex-grow-1 d-flex align-center justify-center"
          >
            <v-progress-circular color="primary" size="70" indeterminate />
          </div>
          <v-list v-else :items="stations" lines="two" item-props />
        </v-card-item>
      </v-card>
    </v-dialog>
  </div>
</template>
