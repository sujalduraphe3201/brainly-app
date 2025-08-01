import Card from "./components/Card";

const App = () => {
  return (
    <div className="" >
      <div className="flex justify-center items-center mt-3">
        <button
          type="button"
          className="bg-[#7164c0] hover:bg-[#5f52aa] transition-colors duration-200 rounded-md px-4 py-2 text-white font-light shadow-sm"
        >
          Add Content
        </button>
        <button
          type="button"
          className="bg-[#95989c] hover:bg-[#7e8186] transition-colors duration-200 rounded-md px-4 py-2 text-white font-medium shadow-sm"
        >
          Share
        </button>
      </div>
      <div className="flex items-center justify-center">
      <Card />
      </div>
    </div>
  );
};

export default App;
