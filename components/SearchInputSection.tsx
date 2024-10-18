import React from 'react';
import Search from '@ui/CustomSearch';
import Header from './Header';

interface SearchInputSectionProps {
    guide:string;
title:string;
  isHeaderVisible: boolean;
  onSearchToggle: () => void;
  onInput: (input: string) => void;
}

const SearchInputSection: React.FC<SearchInputSectionProps> = ({guide,title, isHeaderVisible, onSearchToggle, onInput }) => {
  return (
    <>
      <Header title={title} hide={!isHeaderVisible}>
        <Search onSearchToggle={onSearchToggle} onInput={onInput} />
      </Header>
      {!isHeaderVisible && (
        <div className="p-4 mt-2 w-full flex justify-center items-center">
          <Search
            placeholder={guide}
            onSearchToggle={onSearchToggle}
            initialIsOpen={!isHeaderVisible}
            onInput={onInput}
          />
        </div>
      )}
    </>
  );
};

export default SearchInputSection;
