import SearchHash from "./SearchHash";

export default function App() {
  return (
    <body class="bg-indigo-900 h-screen">
      <header class="w-screen bg-hero-pattern bg-no-repeat bg-cover h-96 transform -skew-y-3 -top-16 absolute">
        <div className="flex justify-center center p-48 transform skew-y-3 font-mono text-gray-100 text-5xl">
          Cardano Explorer
        </div>
      </header>
      <section>
        <SearchHash />
        {/* <div class="has-tooltip">
          <span class="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 -mt-8">
            Some Nice Tooltip Text
          </span>
          Custom Position (above)
        </div> */}
      </section>
    </body>
  );
}
