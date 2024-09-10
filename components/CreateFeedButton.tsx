"use client"
import React from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';

const CreateFeedButton: React.FC = () => {
  return (
    <Link href="/create-feed">
      <button className="fixed bottom-6 right-6 bg-[#4A98E9] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <PlusIcon className="h-8 w-8" />
      </button>
    </Link>
  );
};

export default CreateFeedButton;