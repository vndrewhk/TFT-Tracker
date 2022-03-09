const itemList = {
  [1]: {
    name: "B.F. Sword",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/BF_Sword.dds",
    index: 606,
  },
  [2]: {
    name: "Recurve Bow",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Recurve_Bow.dds",
    index: 554,
  },
  [3]: {
    name: "Needlessly Large Rod",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Needlessly_Large_Rod.dds",
    index: 618,
  },
  [4]: {
    name: "Tear of the Goddess",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Tear_of_the_Goddess.dds",
    index: 568,
  },
  [5]: {
    name: "Chain Vest",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Chain_Vest.dds",
    index: 541,
  },
  [6]: {
    name: "Negatron Cloak",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Negatron_Cloak.dds",
    index: 571,
  },
  [7]: {
    name: "Giant's Belt",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Gaints_Belt.dds",
    index: 613,
  },
  [8]: {
    name: "Spatula",
    icon: "ASSETS/Maps/Particles/TF…ns/Standard/Spatula.dds",
    index: 597,
  },
  [9]: {
    name: "Sparring Gloves",
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Sparring_Gloves.dds",
    index: 579,
  },
  [38]: {
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Spatula/Set6/Arcanist.TFT_Set6.dds",
    id: 38,
    name: "Arcanist Emblem",
    unique: true,
  },
  [89]: {
    icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Spatula/Set6/Assassin.TFT_Set6.dds",
    id: 89,
    name: "Assassin Emblem",
    unique: true,
  },
};


const unitImageHandler = async (unit) => {
  const unitInfo = await fetchUnitInfo(unit);
  // console.log(unitInfo);
  for (const hash in unitInfo.unitInfo) {
    // console.log(unitInfo.unitInfo[hash]);
    for (const key in unitInfo.unitInfo[hash]) {
      if (key === "PortraitIcon") {
        tempUnits = {
          ...tempUnits,
          [unit]: `https://raw.communitydragon.org/latest/game/${unitInfo.unitInfo[
            hash
          ][key]
            .toLowerCase()
            .replace("dds", "png")}`,
        };
      }
    }
  }
  setUnitPortraits(tempUnits);
  setUnitsLoaded(true);
};

export default itemList;
