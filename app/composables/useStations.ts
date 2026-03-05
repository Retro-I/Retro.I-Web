import type { Station } from "@/types/station.ts";
import { v4 as uuidv4 } from "uuid";

export const getMetadata = async (station: Station | null) => {
  if (station === null) return "";
  return await $fetch(`/api/stations/meta-data`, {
    method: "POST",
    body: station,
  });
};

export const searchStations = async (query: string) => {
  const data: Array<object> = await $fetch(
    `https://de1.api.radio-browser.info/json/stations/search?name=${query}`,
  );

  return data.map((station) => {
    return {
      id: uuidv4(),
      name: station.name,
      logo: station.favicon,
      src: station.url_resolved,
    };
  });
};
