import { useCharacterData } from "@/hooks/useCharacterData";
import { User } from "firebase/auth";
import PageCharacterSheetSkeleton from "./PageCharacterSheetSkeleton/PageCharacterSheetSkeleton";
import { CharacterDataContext } from "@/store/CharacterContext";
import CharacterFloatButtons from "./CharacterFloatButtons/CharacterFloatButtons";
import { useModal } from "@/hooks/useModal";
import React from "react";
import { Alert, Col, Divider, Flex, Row } from "antd";
import Hero from "./Hero/Hero";
import { ClassNames } from "@/data/definitions";
import ModalContainer from "../ModalContainer/ModalContainer";
import Section from "./Section/Section";
import AbilitiesTable from "./AbilitiesTable/AbilitiesTable";
import StepAbilities from "../PageNewCharacter/StepAbilities/StepAbilities";
import AttackBonuses from "./AttackBonuses/AttackBonuses";
import HitPoints from "./HitPoints/HitPoints";
import { useDeviceType } from "@/hooks/useDeviceType";
import CharacterStat from "./CharacterStat/CharacterStat";
import { getArmorClass, getHitDice, getMovement } from "@/support/statSupport";
import { getClassType } from "@/support/classSupport";
import SpecialsRestrictions from "./SpecialsRestrictions/SpecialsRestrictions";
import { classes } from "@/data/classes";
import SpecialAbilitiesTable from "./SpecialAbilitiesTable/SpecialAbilitiesTable";
import SavingThrows from "./SavingThrows/SavingThrows";
import { customClassString } from "@/support/stringSupport";
import Money from "./Money/Money";
import Weight from "./Weight/Weight";
import { useSpellData } from "@/hooks/useSpellData";
import Spells from "./Spells/Spells";
import Cantrips from "./Cantrips/Cantrips";
import Equipment from "./Equipment/Equipment";
import Description from "./Description/Description";
import SettingsDrawer from "./SettingsDrawer/SettingsDrawer";
import EditMaxHp from "./EditMaxHp/EditMaxHp";
// import { getCharacter } from "@/apiService";

interface PageCharacterSheetProps {
  user: User | null;
}

// THIS WAS TO TEST THE API
// interface CharacterComponentProps {
//   userId: string;
//   characterId: string;
// }

// const CharacterComponent: React.FC<CharacterComponentProps> = ({
//   userId,
//   characterId,
// }) => {
//   const [character, setCharacter] = React.useState<CharData | null>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     const fetchCharacter = async () => {
//       try {
//         const data = await getCharacter(userId, characterId);
//         setCharacter(data);
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message);
//         } else {
//           setError("An unknown error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCharacter();
//   }, [userId, characterId]);

//   if (loading) console.log("Loading...");
//   if (error) console.log(`Error: ${error}`);
//   if (!character) console.log("No character data found");
//   if (character) console.log(character);
//   return <div></div>;
// };

const PageCharacterSheet: React.FC<
  PageCharacterSheetProps & React.ComponentPropsWithRef<"div">
> = ({ className, user }) => {
  console.info(
    "-Chosen spell descriptions in Level-Up Modal.",
    "-Make use of all ClassSetup and RaceSetup fields.",
  );

  const [open, setOpen] = React.useState(false);
  const { character, characterDispatch, userIsOwner, uid, id } =
    useCharacterData(user);
  const { modalDisplay, setModalDisplay, modalOkRef } = useModal();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const { isSpellCaster } = useSpellData();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Test that character state is not in empty state.
  return character.race ? (
    <CharacterDataContext.Provider
      value={{
        character,
        characterDispatch,
        userIsOwner,
        uid,
        id,
      }}
    >
      <CharacterFloatButtons
        setModalDisplay={setModalDisplay}
        modalOk={modalOkRef.current}
        openSettingsDrawer={showDrawer}
      />
      <Flex vertical className={className} gap={16}>
        <Hero setModalDisplay={setModalDisplay} />
        <Row gutter={16} className="[&>div]:mt-4">
          <Col xs={24} sm={12} md={8}>
            <Section
              title="Abilities"
              component={<AbilitiesTable />}
              editableComponent={
                <StepAbilities
                  character={character}
                  characterDispatch={characterDispatch}
                />
              }
              editable
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Flex gap={16} vertical>
              <Section
                title="Attack Bonuses"
                titleHelpText={`**Melee** attacks use STR modifier + Attack Bonus.\n\n**Missile** attacks use DEX modifier + Attack Bonus.`}
                component={<AttackBonuses />}
              />
              <Section
                title="Hit Points"
                component={<HitPoints />}
                editable
                editableComponent={<EditMaxHp />}
              />
            </Flex>
          </Col>
          <Col xs={24} md={8}>
            <Flex
              gap={16}
              vertical={isMobile || isTablet || isDesktop}
              justify="space-between"
            >
              <Section
                title="Armor Class"
                titleHelpText={`Base AC is 11.\n\nSelect the armor/shield your character is wearing in the Equipment section below.`}
                component={
                  <CharacterStat
                    value={getArmorClass(character, characterDispatch) || 0}
                  />
                }
              />
              <Section
                title="Movement"
                titleHelpText={`Movement starts at 40' and is affected by how much weight your character is carrying as well as the armor they are wearing.`}
                component={
                  <CharacterStat value={`${getMovement(character)}'`} />
                }
              />
              <Section
                title="Hit Dice"
                component={
                  <CharacterStat
                    value={getHitDice(
                      character.level,
                      character,
                      character.hp.dice,
                    )}
                  />
                }
              />
            </Flex>
          </Col>
        </Row>
        <Divider />
        {getClassType(character.class).includes("standard") ? (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={14}>
              <Section
                title="Restrictions & Special Abilities"
                component={<SpecialsRestrictions />}
              />
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Flex gap={16} vertical>
                {character.class.map((cls: string) => {
                  const specialAbilities =
                    classes[cls as ClassNames]?.specialAbilities;
                  if (specialAbilities) {
                    return (
                      <Section
                        key={cls}
                        title={`${cls} Abilities Table`}
                        titleHelpText={`A player must roll their percentile dice with a result less than or equal to the numbers shown below. Click the rows to automatically roll for each special ability.`}
                        component={
                          <SpecialAbilitiesTable
                            specialAbilities={specialAbilities}
                          />
                        }
                        className={isMobile ? "mt-4" : ""}
                      />
                    );
                  }
                })}
                <Section
                  title="Saving Throws"
                  component={<SavingThrows />}
                  className="[@media(width<=640px)]:mt-4"
                  titleHelpText={`Roll 1d20. Pass if above the number shown.\n\nPoison saving throws are made w/ CON modifier.\n\nSaving throws against illusions are made w/ INT modifier.\n\nSaving throws against charm spells (and other forms of mind control) are made w/ WIS modifier.`}
                />
              </Flex>
            </Col>
          </Row>
        ) : (
          <Alert type="info" message={customClassString} />
        )}
        <Divider />
        <Row gutter={32}>
          <Col xs={24} sm={12}>
            <Flex gap={16} vertical={isMobile} justify="space-between">
              <Section
                title="Money"
                className={!isMobile ? "w-1/3" : ""}
                component={<Money />}
              />
              <Divider className="[@media(width>=640px)]:hidden" />
              <Section title="Weight" component={<Weight />} />
              <Divider className="[@media(width>=640px)]:hidden" />
            </Flex>
            {isSpellCaster(character) && (
              <Flex gap={16} vertical>
                <Section
                  title="Spells"
                  className="mt-4"
                  component={<Spells />}
                />
                <Section title="Cantrips/Orisons" component={<Cantrips />} />
                <Divider className="[@media(width>=640px)]:hidden" />
              </Flex>
            )}
          </Col>
          <Col xs={24} sm={12}>
            <Section
              title="Equipment"
              className="mt-4 sm:m-0"
              component={<Equipment setModalDisplay={setModalDisplay} />}
              editable
              editableClick={showDrawer}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={24}>
            <Section
              title="Bio & Notes"
              component={<Description isMobile={isMobile} />}
            />
          </Col>
        </Row>
      </Flex>
      {userIsOwner && (
        <SettingsDrawer
          onClose={onClose}
          open={open}
          isSpellCaster={isSpellCaster(character)}
        />
      )}
      <ModalContainer
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        modalOk={modalOkRef.current}
      />

      {/* <CharacterComponent
        userId="AsxtzoU61db5IAA6d9IrEFFjh6a2"
        characterId="8RfWJpXr7Rh8ecskTtTN"
      /> */}
    </CharacterDataContext.Provider>
  ) : (
    <PageCharacterSheetSkeleton />
  );
};

export default PageCharacterSheet;
