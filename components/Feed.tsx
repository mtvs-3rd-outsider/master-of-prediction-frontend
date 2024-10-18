// "use client";
// import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
// import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import { Skeleton } from '@nextui-org/skeleton';
// import Image from 'next/image';

// const Post = dynamic(() => import('@ui/Post'), {
//   suspense: true,
// });

// interface PostItem {
//   id: string;
//   name: string;
//   username: string;
//   content: string;
//   description: string;
//   date: string;
//   src: string;
//   following: string;
//   followers: string;
//   initials: string;
//   viewCount: string;
//   image?: React.ReactNode;
// }

// const initialItems: PostItem[] = [
//   {
//     id: '1',
//     name: 'Jane Doe',
//     username: 'janedoe',
//     following: '249',
//     followers: '663',
//     content: 'Design and build templates',
//     description:
//       'Improve your design skills by making projects. 1 every week, practice with me on Youtube. I use Figma, Tailwind CSS and Webflow.',
//     date: '1h',
//     src: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '1000',
//     image: (
//       <div className="w-full relative h-80 mb-4">
//         <Image
//           layout='fill'
//           objectFit='cover'
//           className="rounded-3xl"
//           src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
//           alt="Gradient"
//           priority
//         />
//       </div>
//     ),
//   },
//   {
//     id: '2',
//     name: 'John Doe',
//     username: 'johndoe',
//     following: '138',
//     followers: '2,218',
//     content: 'I love Figma',
//     description: 'I design and hug auto layout everyday',
//     date: '2h',
//     src: 'https://images.unsplash.com/photo-1532123675048-773bd75df1b4?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '500',
//   },
//   {
//     id: '3',
//     name: 'Jessica Doe',
//     username: 'jessicadoe',
//     following: '866',
//     followers: '1001',
//     content: 'Tailwind CSS is insane',
//     description:
//       'Should designers code. Should you rename your Figma layers is the 1 billion…',
//     date: '3h',
//     src: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '750',
//   },
//   {
//     id: '4',
//     name: 'Joe Doe',
//     username: 'joedoe',
//     following: '668',
//     followers: '1985',
//     content: 'Next JS documentation is so good',
//     description: 'Next JS enthusiast',
//     date: '4h',
//     src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '300',
//   },
//   {
//     id: '5',
//     name: 'Jill Doe',
//     username: 'jilldoe',
//     following: '256',
//     followers: '148',
//     content: 'How to use custom fonts with Storybook',
//     description: 'Sharing my journey on Storybook, Next JS and Tailwind CSS',
//     date: '5h',
//     src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '600',
//   },
//   {
//     id: '6',
//     name: 'Jeff Doe',
//     username: 'jeffdoe',
//     following: '232',
//     followers: '89',
//     content: 'Why use Storybook?',
//     description: 'Learning and building projects with Next JS',
//     date: '6h',
//     src: 'https://images.unsplash.com/photo-1642060603505-e716140d45d2?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '400',
//   },
//   {
//     id: '7',
//     name: 'Jean Doe',
//     username: 'jeandoe',
//     following: '186',
//     followers: '90',
//     content: 'Vercel and Netlify are pretty cool',
//     description: 'Radix UI Avenger',
//     date: '7h',
//     src: 'https://images.unsplash.com/photo-1597248374161-426f0d6d2fc9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '800',
//   },
//   {
//     id: '8',
//     name: 'Jack Doe',
//     username: 'jackdoe',
//     following: '56',
//     followers: '24',
//     content: 'Webflow community is awesome',
//     description: 'Currently redesigning my portfolio for the 8th time today',
//     date: '8h',
//     src: '',
//     initials: 'JD',
//     viewCount: '200',
//   },
//   {
//     id: '9',
//     name: 'Jenny Doe',
//     username: 'jennydoe',
//     following: '56',
//     followers: '23',
//     content: 'Radix UI is nice to integrate',
//     description: 'Figma and Next JS aficionado',
//     date: '9h',
//     src: 'https://images.unsplash.com/photo-1597004897768-c503466472cc?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
//     initials: 'JD',
//     viewCount: '350',
//   },
// ];
// const fetchMoreItems = (currentPage: number): PostItem[] => {
//   return initialItems.map((item, index) => ({
//     ...item,
//     id: `${currentPage}-${index}`,
//     name: `${item.name} ${currentPage}-${index}`,
//   }));
// };

// const Feed: React.FC = () => {
//   const [items, setItems] = useState<PostItem[]>(initialItems);
//   const [page, setPage] = useState(1);
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const router = useRouter();

//   const lastItemRef = useCallback(
//     (node: HTMLLIElement) => {
//       if (observerRef.current) observerRef.current.disconnect();

//       observerRef.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observerRef.current.observe(node);
//     },
//     []
//   );

//   useEffect(() => {
//     const newItems = fetchMoreItems(page);
//     setItems((prevItems) => [...prevItems, ...newItems]);
//   }, [page]);

//   const handlePostClick = (id: string) => {
//     router.push(`/feed/${id}`);
//   };

//   return (
//     <Suspense fallback={<Loading />}>
//       <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
//         {items.map(
//           (
//             {
//               id,
//               name,
//               username,
//               content,
//               date,
//               src,
//               initials,
//               image,
//               following,
//               followers,
//               description,
//               viewCount,
//             },
//             i
//           ) => (
//             <li
//               key={id}
//               className="p-4 cursor-pointer"
//               ref={i === items.length - 1 ? lastItemRef : null}
//               onClick={() => handlePostClick(id)}
//             >
//               <Post
//                 id={id}
//                 name={name}
//                 username={username}
//                 content={content}
//                 date={date}
//                 src={src}
//                 initials={initials}
//                 description={description}
//                 followers={followers}
//                 following={following}
//                 viewCount={viewCount}
                
//               >
//                 {image}
//               </Post>
//             </li>
//           )
//         )}
//       </ul>
//     </Suspense>
//   );
// };

// export default Feed;

// const Loading: React.FC = () => {
//   return (
//     <Suspense fallback={<div>Loading skeleton...</div>}>
//       <Skeleton className="rounded-lg">
//         <div className="h-24 rounded-lg bg-default-300"></div>
//       </Skeleton>
//     </Suspense>
//   );
// };