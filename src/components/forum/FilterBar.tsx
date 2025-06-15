import Button from "@/components/ui/Button";
import { FACULTIES, SORT_OPTIONS } from "@/constants/index";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFaculty: string[];
  setSelectedFaculty: (faculties: string[]) => void;
  selectedTag: string[];
  setSelectedTag: (tags: string[]) => void;
  isFacultyDropdownOpen: boolean;
  setIsFacultyDropdownOpen: (isOpen: boolean) => void;
  isTagPanelOpen: boolean;
  setIsTagPanelOpen: (isOpen: boolean) => void;
  selectedSortOption: string;
  setSelectedSortOption: (option: string) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (isOpen: boolean) => void;
  allTags: string[];
  resetFilters: () => void;
}

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedFaculty,
  setSelectedFaculty,
  selectedTag,
  setSelectedTag,
  isFacultyDropdownOpen,
  setIsFacultyDropdownOpen,
  isTagPanelOpen,
  setIsTagPanelOpen,
  selectedSortOption,
  setSelectedSortOption,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  allTags,
  resetFilters,
}: FilterBarProps) => {
  const isFacultyActive = isFacultyDropdownOpen || selectedFaculty.length > 0;
  const isTagActive = isTagPanelOpen || selectedTag.length > 0;
  const isSortActive = isSortDropdownOpen || selectedSortOption !== "newest";

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Top row: Search, Faculty, หัวข้อ, Filter, Reset */}
      <div className="flex items-center gap-4 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="search"
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Faculty Dropdown Button */}
        <Button
          className={`!px-6 !py-3 !rounded-xl !font-medium !text-lg transition-all flex items-center gap-2 ${
            isFacultyActive
              ? "!bg-green-600 !text-white hover:!bg-green-500"
              : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
          }`}
          type="button"
          onClick={() => {
            setIsFacultyDropdownOpen(!isFacultyDropdownOpen);
            setIsTagPanelOpen(false);
            setIsSortDropdownOpen(false);
          }}
        >
          คณะ
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isFacultyDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>

        {/* หัวข้อ (Topic) Button */}
        <Button
          className={`!px-6 !py-3 !rounded-xl !font-medium !text-lg transition-all flex items-center gap-2 ${
            isTagActive
              ? "!bg-green-600 !text-white hover:!bg-green-500"
              : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
          }`}
          type="button"
          onClick={() => {
            setIsTagPanelOpen(!isTagPanelOpen);
            setIsFacultyDropdownOpen(false);
            setIsSortDropdownOpen(false);
          }}
        >
          หัวข้อ
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isTagPanelOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>

        {/* Sort Button and Dropdown */}
        <div className="relative">
          <Button
            className={`!px-6 !py-3 !rounded-xl !font-medium !text-lg transition-all flex items-center gap-2 ${
              isSortActive
                ? "!bg-[#22c55e] !text-white hover:!bg-[#16a34a]"
                : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
            }`}
            type="button"
            onClick={() => {
              setIsSortDropdownOpen(!isSortDropdownOpen);
              setIsFacultyDropdownOpen(false);
              setIsTagPanelOpen(false);
            }}
          >
            {SORT_OPTIONS.find(
              (option: { value: string; label: string }) =>
                option.value === selectedSortOption
            )?.label || "เรียงลำดับ"}
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isSortDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              {SORT_OPTIONS.map((option: { value: string; label: string }) => (
                <button
                  key={option.value}
                  className={`block w-full text-left px-4 py-2 text-base font-medium transition-all ${
                    selectedSortOption === option.value
                      ? "bg-[#22c55e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedSortOption(option.value);
                    setIsSortDropdownOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Button */}
        <Button
          className="!px-4 !py-2 !rounded-xl !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-base transition-all hover:!bg-gray-100"
          type="button"
          onClick={resetFilters}
        >
          ล้าง
        </Button>
      </div>

      {/* Expanded Faculty Filter Area */}
      {isFacultyDropdownOpen && (
        <div className="w-full bg-[#E6F4EA] rounded-xl p-6 flex flex-wrap gap-3 items-center">
          {FACULTIES.map((faculty: string) => (
            <Button
              key={faculty}
              className={`!px-5 !py-2 !rounded-full  !text-gray-700 !border-2 !font-medium !text-base transition-all ${
                selectedFaculty.includes(faculty) ||
                (faculty === "ทุกคณะ" && selectedFaculty.length === 0)
                  ? "!bg-green-500 !text-white !border-none"
                  : "bg-white !text-gray-700 hover:!bg-gray-200 !border-gray-300"
              }`}
              type="button"
              onClick={() => {
                if (faculty === "ทุกคณะ") {
                  setSelectedFaculty([]);
                } else if (selectedFaculty.includes(faculty)) {
                  setSelectedFaculty(
                    selectedFaculty.filter((f: string) => f !== faculty)
                  );
                } else {
                  setSelectedFaculty([...selectedFaculty, faculty]);
                }
              }}
            >
              {faculty}
            </Button>
          ))}
        </div>
      )}

      {/* Expanded tag filter area (only for predefined tags) */}
      {isTagPanelOpen && (
        <div className="w-full bg-[#E6F4EA] rounded-xl p-6 flex flex-wrap gap-3 items-center">
          <Button
            className={`!px-5 !py-2 !rounded-full !border-2 !font-medium !text-base transition-all ${
              selectedTag.length === 0
                ? "!bg-green-500 !text-white !border-none"
                : "bg-white !text-gray-700 hover:!bg-gray-200 !border-gray-300"
            }`}
            type="button"
            onClick={() => setSelectedTag([])}
          >
            ทั้งหมด
          </Button>
          {allTags.map((tag: string) => (
            <Button
              key={tag}
              className={`!px-5 !py-2 !rounded-full !border-2 !font-medium !text-base transition-all ${
                selectedTag.includes(tag)
                  ? "!bg-green-500 !text-white !border-none"
                  : "bg-white !text-gray-700 hover:!bg-gray-200 !border-gray-300"
              }`}
              type="button"
              onClick={() => {
                if (selectedTag.includes(tag)) {
                  setSelectedTag(selectedTag.filter((t: string) => t !== tag));
                } else {
                  setSelectedTag([...selectedTag, tag]);
                }
              }}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
