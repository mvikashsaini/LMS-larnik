import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center w-full max-w-md px-4 py-2 rounded-full mx-auto m-4 bg-white shadow-sm">
      <Search className="text-green-500 mr-2" />
      <input
        type="text"
        placeholder="Search...."
        className="w-full outline-none bg-white text-black"
      />
    </div>
  );
}
