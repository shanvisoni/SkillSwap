export const searchService = {
    searchBySkill: async (skill) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?skill=${skill}`);
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        return await response.json();
      } catch (error) {
        console.error("Search API error:", error);
        return [];
      }
    },
  };
  