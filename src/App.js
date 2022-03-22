import SearchHash from "./SearchHash";

export default function App() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-800 via-purple-800 to-purple-700 h-screen overflow-hidden">
      <div className="text-center pt-10 text-gray-100 text-4xl">
        Mimir - The Visual Cardano Explorer
      </div>
      <div className="flex justify-center text-center pt-6 text-gray-100 text-xl font-extralight">
        <span className="w-2/4">
          Search by <strong>Transaction Hash</strong>
          {/* or{" "} <strong>Address</strong> */}
        </span>
      </div>

      {/* right bubbles */}
      <div className="absolute animate-pulse bg-purple-600 opacity-20 rounded-full w-80 h-80 -top-14 left-36" />
      <div className="absolute animate-pulse bg-pink-600 opacity-10 rounded-full w-48 h-48 left-9" />
      <div className="absolute animate-pulse bg-pink-200 opacity-20 rounded-full w-56 h-56 -bottom-2 -left-9" />
      <div className="absolute animate-pulse bg-indigo-200 opacity-20 rounded-full w-40 h-40 -bottom-16 left-28" />

      {/* left bubbles */}
      <div className="absolute animate-pulse bg-indigo-200 opacity-20 rounded-full w-28 h-28 -top-10 right-1/3" />
      <div className="absolute animate-pulse bg-pink-200 opacity-20 rounded-full w-32 h-32 top-4 right-36" />
      <div className="absolute animate-pulse bg-purple-600 opacity-20 rounded-full w-52 h-52 top-36 right-14" />
      <div className="absolute animate-pulse bg-pink-500 opacity-10 rounded-full w-44 h-44 top-24 right-48" />
      <div className="absolute animate-pulse bg-pink-200 opacity-20 rounded-full w-24 h-24 bottom-64 -right-12" />
      <div className="absolute animate-pulse bg-purple-600 opacity-50 rounded-full w-80 h-80 -bottom-8 -right-36" />

      <SearchHash />
    </div>
  );
}
