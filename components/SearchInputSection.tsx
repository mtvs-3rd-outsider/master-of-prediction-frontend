import React from 'react';
import Search from '@ui/CustomSearch';
import Header from './Header';

interface SearchInputSectionProps {
    guide: string;
    title: string;
    isHeaderVisible: boolean;
    onSearchToggle: () => void;
    onInput: (input: string) => void;
    onSortChange: (value: string) => void;  // 추가된 props
}

const SearchInputSection: React.FC<SearchInputSectionProps> = ({
    guide,
    title, 
    isHeaderVisible, 
    onSearchToggle, 
    onInput,
    onSortChange  // 추가된 props
}) => {
  return (
    <>
      <Header 
        title={title} 
        hide={!isHeaderVisible}
        onSortChange={onSortChange}  // Header 컴포넌트에 전달
      >
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