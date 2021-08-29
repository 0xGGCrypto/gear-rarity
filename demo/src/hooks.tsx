import { useEffect, useState } from "react";
import { itemRarity, rarityColor, rarityDescription, Rarity } from "../..";
import loot from "../../data/loot.json";

type ItemRarityInfo = {
  color?: string;
  name: string;
  rarity?: Rarity;
  description?: string;
};

export function useItemRarity(
  names: Array<string> = []
): Array<ItemRarityInfo> {
  const [infoList, setInfoList] = useState<Array<ItemRarityInfo>>([]);

  const key = JSON.stringify(names);

  useEffect(() => {
    let cancelled = false;

    setInfoList(
      names.map((name: string) => ({
        color: undefined,
        description: undefined,
        name,
        rarity: undefined,
      }))
    );

    const load = async () => {
      const infoList = await Promise.all(
        names.map(async (name) => {
          const rarity = await itemRarity(name);
          const color = await rarityColor(rarity);
          const description = await rarityDescription(rarity);
          return { color, description, name, rarity };
        })
      );
      if (!cancelled) {
        setInfoList(infoList);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return infoList;
}

export function randomBagId() {
  return String(Math.floor(Math.random() * 7999) + 1);
}

export function useBag(
  id: string = randomBagId()
): null | { id: string; items: Array<string> } {
  const bagId = Number(id);

  if (isNaN(bagId) || bagId < 1 || bagId > 8000) {
    return null;
  }

  return {
    id: String(bagId),
    items: Object.values(loot[bagId - 1][bagId]),
  };
}
