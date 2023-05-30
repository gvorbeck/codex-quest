import { useParams } from "react-router-dom";

export default function CharacterSheet() {
  const { id } = useParams();

  // Now you can use this id to load the appropriate character details from your database

  return (
    <div>
      hello world - {id}
      {/* Render your character details here */}
    </div>
  );
}
