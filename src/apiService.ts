const BASE_URL = "https://us-central1-codex-quest.cloudfunctions.net";

export const getCharacter = async (userId: string, characterId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/getCharacter?userId=${userId}&characterId=${characterId}`,
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching character:", error);
    throw error;
  }
};

export const listCharacters = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/listCharacters?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error listing characters:", error);
    throw error;
  }
};
