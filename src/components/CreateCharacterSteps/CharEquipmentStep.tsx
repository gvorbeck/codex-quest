import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

interface Weapon {
  costCurrency: string;
  costValue: number;
  name: string;
  size: string;
  weight: number;
}

interface Axe extends Weapon {
  damage: string;
}

interface Bow extends Weapon {}

type CharEquipmentStepProps = {
  gold: number;
  equipment: {};
  setGold: (gold: number) => void;
  setEquipment: (equipment: {}) => void;
};

export default function CharEquipmentStep({
  gold,
  equipment,
  setGold,
  setEquipment,
}: CharEquipmentStepProps) {
  const [axes, setAxes] = useState<Axe[]>([]);
  const [bows, setBows] = useState<Bow[]>([]);

  useEffect(() => {
    const fetchAxes = async () => {
      const axesCollection = collection(db, "axes");
      const axesSnapshot = await getDocs(axesCollection);
      const axesArray = axesSnapshot.docs.map((doc) => doc.data() as Axe);
      setAxes(axesArray);
    };

    const fetchBows = async () => {
      const bowsCollection = collection(db, "bows");
      const bowsSnapshot = await getDocs(bowsCollection);
      const bowsArray = bowsSnapshot.docs.map((doc) => doc.data() as Bow);
      setBows(bowsArray);
    };

    Promise.all([fetchAxes(), fetchBows()])
      .then(() => console.log("Data fetched from all collections"))
      .catch((error) =>
        console.error("Error fetching data from collections", error)
      );
  }, []);

  // useEffect(() => console.log("foo", axes), [axes]);

  return <div />;
}
