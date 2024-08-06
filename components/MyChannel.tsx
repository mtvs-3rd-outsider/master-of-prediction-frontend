import React from 'react';

const tweets = [
  { id: 1, content: 'Hello, world!' },
  { id: 2, content: 'Learning Next.js and Tailwind CSS!' },
  // 더 많은 트윗 추가 가능
];

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full" src="/profile.jpg" alt="Profile Picture" />
          <div>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-gray-500">@johndoe</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Tweets</h3>
          <ul className="mt-4 space-y-4">
            {tweets.map((tweet) => (
              <li key={tweet.id} className="bg-gray-50 p-4 rounded-lg shadow">
                {tweet.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
