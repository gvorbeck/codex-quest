import { Typography } from "antd";
import { SavingThrowsFootnotesProps } from "./definitions";
import { classes } from "../../../../data/classes";
import { ClassNames } from "../../../../data/definitions";
import { marked } from "marked";

export default function SavingThrowsFootnotes({
  characterData,
}: SavingThrowsFootnotesProps) {
  return (
    <div className="mt-2 italic">
      {characterData.abilities.modifiers.constitution !== "+0" && (
        <Typography.Text className="text-shipGray block">
          <div
            dangerouslySetInnerHTML={{
              __html: marked(
                `* Adjust your roll by ${characterData.abilities.modifiers.constitution} against <strong>Posion</strong> saving throws.`
              ),
            }}
          />
        </Typography.Text>
      )}
      {characterData.abilities.modifiers.intelligence !== "+0" && (
        <Typography.Text className="text-shipGray block">
          <div
            dangerouslySetInnerHTML={{
              __html: marked(
                `* Adjust your roll by ${characterData.abilities.modifiers.intelligence} against illusions.`
              ),
            }}
          />
        </Typography.Text>
      )}
      {characterData.abilities.modifiers.wisdom !== "+0" && (
        <Typography.Text className="text-shipGray block">
          <div
            dangerouslySetInnerHTML={{
              __html:
                marked(`* Adjust your roll by ${characterData.abilities.modifiers.wisdom}
          against **charm** spells and other forms of mind control.`),
            }}
          />
        </Typography.Text>
      )}
      {characterData.class.map(
        (className) =>
          classes[className as ClassNames]?.savingThrowsNotes?.map((note) => (
            <Typography.Text key={note} className="text-shipGray block">
              <div dangerouslySetInnerHTML={{ __html: marked(note) }} />
            </Typography.Text>
          ))
      )}
    </div>
  );
}
