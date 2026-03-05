import stationsJson from "@/assets/radio-stations.json";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Station } from "../types/station";

export const useStationsStore = defineStore("stations", () => {
  const stations = useLocalStorage<Station[]>("stations-list", stationsJson, {
    initOnMounted: true,
  });

  function add(item: Station) {
    stations.value.push(item);
  }

  function remove(id: string) {
    stations.value = stations.value.filter((s) => s.id !== id);
  }

  return { stations, add, remove };
});
