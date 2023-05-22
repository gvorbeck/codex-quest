import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

interface Weapon {
  costCurrency: string;
  costValue: number;
  name: string;
  size?: string;
  weight: number;
  damage?: string;
}

type Axe = Weapon;
type Bow = Weapon;
type Dagger = Weapon;
type Sword = Weapon;
type HammerMace = Weapon;
type OtherWeapon = Weapon;
type Ammunition = Weapon;

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
  const [daggers, setDaggers] = useState<Dagger[]>([]);
  const [swords, setSwords] = useState<Sword[]>([]);
  const [hammersMaces, setHammersMaces] = useState<HammerMace[]>([]);
  const [otherWeapons, setOtherWeapons] = useState<OtherWeapon[]>([]);
  const [ammunition, setAmmunition] = useState<Ammunition[]>([]);

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

    const fetchDaggers = async () => {
      const daggersCollection = collection(db, "daggers");
      const daggersSnapshot = await getDocs(daggersCollection);
      const daggersArray = daggersSnapshot.docs.map(
        (doc) => doc.data() as Dagger
      );
      setDaggers(daggersArray);
    };

    const fetchSwords = async () => {
      const swordsCollection = collection(db, "swords");
      const swordsSnapshot = await getDocs(swordsCollection);
      const swordsArray = swordsSnapshot.docs.map((doc) => doc.data() as Sword);
      setSwords(swordsArray);
    };

    const fetchHammerMaces = async () => {
      const hammersMacesCollection = collection(db, "hammers-maces");
      const hammersMacesSnapshot = await getDocs(hammersMacesCollection);
      const hammersMacesArray = hammersMacesSnapshot.docs.map(
        (doc) => doc.data() as HammerMace
      );
      setHammersMaces(hammersMacesArray);
    };

    const fetchOtherWeapons = async () => {
      const otherWepaonsCollection = collection(db, "other-weapons");
      const otherWepaonsSnapshot = await getDocs(otherWepaonsCollection);
      const otherWepaonsArray = otherWepaonsSnapshot.docs.map(
        (doc) => doc.data() as OtherWeapon
      );
      setOtherWeapons(otherWepaonsArray);
    };

    const fetchAmmunition = async () => {
      const ammunitionCollection = collection(db, "ammunition");
      const ammunitionSnapshot = await getDocs(ammunitionCollection);
      const ammunitionArray = ammunitionSnapshot.docs.map(
        (doc) => doc.data() as Ammunition
      );
      setAmmunition(ammunitionArray);
    };

    Promise.all([
      fetchAxes(),
      fetchBows(),
      fetchDaggers(),
      fetchSwords(),
      fetchHammerMaces(),
      fetchOtherWeapons(),
      fetchAmmunition(),
    ])
      .then(() => console.log("Data fetched from all collections"))
      .catch((error) =>
        console.error("Error fetching data from collections", error)
      );
  }, []);

  // useEffect(() => console.log("foo", axes), [axes]);

  return <div />;
}
