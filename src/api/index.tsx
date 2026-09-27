import { Character, Reaction } from '../types';

// Improvement: type CharacterResponse = { results: Character[]; total: number };
export async function fetchCharacters(name: string, page: number, limit: number): Promise<{ results: Character[]; total: number }> {
  const res = await fetch(`/api/characters?name=${name}&page=${page}&limit=${limit}`);
  return res.json();
}

export async function fetchReactions(): Promise<{ reactions: Reaction[] }> {
  const res = await fetch('/api/reactions');
  return res.json();
}

// Production improvement: use AbortController to cancel an in-flight request when searchQuery or page changes.
// Check res.ok and throw an error if not ok. Handle errors in the component and display a message to the user.
// Use URLSearchParams, more robust.