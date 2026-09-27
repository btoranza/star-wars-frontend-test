import React, { useState } from 'react';

import { Button, Chip, ColorPalette, Theme } from '@lumx/react';

import { Character, Reaction } from '../../types';

import styles from './CharacterCard.module.scss';

interface CharacterCardProps {
  character: Character;
  reactions: Reaction[];
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  reactions,
}) => {
  const [emojiCount, setEmojiCount] = useState<Record<string, number>>({});

  const onClickReaction = (emoji: string) => {
    setEmojiCount(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const activeReactions = reactions.filter(r => !r.deleted);

  const groupedReactions = activeReactions.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.content] = (acc[r.content] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <article className={styles.card}>
      {character.imageUrl ? (
        <img
          className={styles.image}
          src={character.imageUrl}
          alt={character.name}
        />
      ) : (
        <div className={styles.imagePlaceholder}>
          {character.name.charAt(0)}
        </div>
      )}

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h2 className={styles.name}>{character.name}</h2>

          {character.species && (
            <Chip
              className={styles.chipBlue}
              theme={Theme.dark}
              color={ColorPalette.blue}
            >
              {character.species}
            </Chip>
          )}

          {character.birthYear && (
            <Chip
              className={styles.chipGreen}
              theme={Theme.dark}
              color={ColorPalette.green}
            >
              {character.birthYear}
            </Chip>
          )}
        </div>

        {character.description && (
          <p className={styles.description}>{character.description}</p>
        )}

        {character.affiliations.length > 0 && (
          <div className={styles.affiliations}>
            {character.affiliations.map(affiliation => (
              <Chip key={affiliation} theme={Theme.dark}>
                {affiliation}
              </Chip>
            ))}
          </div>
        )}

        {Object.keys(groupedReactions).length > 0 && (
          <div className={styles.reactions}>
            {Object.entries(groupedReactions).map(([emoji, count]) => {
              const addedCount = emojiCount[emoji] || 0;
              const totalCount = count + addedCount;

              return (
                <Button
                  key={emoji}
                  className={styles.reaction}
                  onClick={() => onClickReaction(emoji)}
                >
                  {emoji}
                  {totalCount > 1 && (
                    <span className={styles.reactionCount}>
                      {totalCount}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};