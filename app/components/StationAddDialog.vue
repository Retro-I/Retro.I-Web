<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  item: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["close", "playStation", "saveStationToList"]);

function playStation() {
  emit("playStation", props.item);
  emit("close");
}

function saveStationToList() {
  emit("saveStationToList", props.item);
  emit("close");
}
</script>

<template>
  <div>
    <v-dialog
      max-width="700"
      :model-value="modelValue"
      @update:model-value="emit('close')"
    >
      <v-card :title="item.name">
        <v-divider />
        <template #actions>
          <v-btn
            class="ms-auto"
            color="primary"
            text="Abspielen"
            variant="elevated"
            @click="playStation()"
          />
          <v-spacer />
          <v-btn
            class="ms-auto"
            color="primary"
            text="Zu Liste hinzufügen"
            variant="elevated"
            @click="saveStationToList()"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
