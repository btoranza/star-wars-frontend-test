import React, { useEffect, useState } from 'react';

import { FlexBox, Thumbnail, TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';
import { useDebounce } from '../../hooks/useDebounce';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  // IMPROVEMENT: Potential duplicate search when Enter is pressed before the debounce timer expires.
  // Also check handleClear for potential duplication.
  // Making the debounce cancellable or centralizing the search trigger

  return (
    <header className={styles.header}>

      <FlexBox className={styles.logo} orientation="horizontal" vAlign="space-between" hAlign="center">
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          className={styles.searchField}
          theme={Theme.light}
          icon={mdiMagnify}
          onChange={setValue}
          onKeyDown={handleKeyDown}
          label="Search"
          value={value}
          clearButtonProps={value ? { label: 'Clear search', onClick: handleClear } : undefined}
        />
      </FlexBox>

    </header>
  );
};