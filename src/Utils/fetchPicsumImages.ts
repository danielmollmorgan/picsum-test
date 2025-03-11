async function fetchPicsumImages(page = 1, limit = 10) {
  try {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch images");
    return await response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

export default fetchPicsumImages;