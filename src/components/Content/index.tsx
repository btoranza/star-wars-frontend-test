import React, { useEffect, useRef, useState } from 'react';
import { ProgressCircular, Theme } from '@lumx/react';
import { fetchCharacters, fetchReactions } from '../../api';
import { Character, Reaction } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { Pagination } from '../Pagination';
import styles from './Content.module.scss';

const PAGE_SIZE = 4;

interface ContentProps {
  searchQuery: string;
}

export const Content: React.FC<ContentProps> = ({ searchQuery }) => {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const prevSearchQuery = useRef(searchQuery);

  useEffect(() => {
    const pageToFetch = prevSearchQuery.current !== searchQuery ? 1 : page;
    prevSearchQuery.current = searchQuery;

    if (pageToFetch !== page) {
      setPage(1);
      return;
    }

    setIsLoading(true);
    setError(null);
    fetchCharacters(searchQuery, pageToFetch, PAGE_SIZE)
      .then(data => {
        setCharacters(data.results);
        setTotal(data.total);
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [searchQuery, page]);

  useEffect(() => {
    fetchReactions().then(data => setReactions(data.reactions));
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.centered}>
            <ProgressCircular theme={Theme.dark} />
          </div>
        ) : error ? (
          <div className={styles.centered}>
            <p>{error}</p>
          </div>
        ) : characters.length === 0 ? (
          <div className={styles.centered}>
            <p>No characters found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
          </div>
        ) : (
          characters.map((character) => {
            const characterReactions = reactions.filter(r => r.characterId === character.id);
            return <CharacterCard key={character.id} character={character} reactions={characterReactions} />;
          })
        )}
      </div>
      <div className={styles.paginationBar}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

// const reactionsByCharacter = new Map();

// reactions.forEach(reaction => {
//   const existing = reactionsByCharacter.get(reaction.characterId) ?? [];
//   existing.push(reaction);
//   reactionsByCharacter.set(reaction.characterId, existing);
// });
