export const getCharacter = async (userId: string, characterId: string) => {
  try {
    const response = await fetch(
      `/api/users/${userId}/characters/${characterId}`,
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
    const response = await fetch(`/api/users/${userId}/characters/list`);
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
