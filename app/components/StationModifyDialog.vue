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

const emit = defineEmits(["close", "delete"]);

function deleteStation() {
  emit("delete", props.item);
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
      <v-card :title="item?.name || ''">
        <v-divider />
        <template #actions>
          <v-spacer />
          <v-btn
            class="ms-auto"
            color="primary"
            text="Löschen"
            variant="elevated"
            rounded="xl"
            @click="deleteStation()"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
