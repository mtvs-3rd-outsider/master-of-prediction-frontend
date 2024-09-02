"use client";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기

const Search = () => (
	<div className="sticky top-0 bg-white py-2 mb-3">
		<form className="flex flex-col flex-1 gap-y-4">
			<div className="flex flex-1 relative">
				<MagnifyingGlassIcon className="w-5 h-5 left-2.5 top-2 absolute flex items-center" /> {/* Heroicons 아이콘 사용 */}
				<input
					type="search"
					placeholder="Search"
					className="w-full flex items-center pl-10 pr-4 text-sm placeholder:text-sm placeholder:font-medium py-2 bg-slate-100 border-slate-100 placeholder:text-slate-700 rounded-full"
				/>
				<button className="sr-only bg-slate-900 font-bold text-white px-4 py-2 text-sm rounded-full">
					Tweet
				</button>
			</div>
		</form>
	</div>
);

export default Search;
