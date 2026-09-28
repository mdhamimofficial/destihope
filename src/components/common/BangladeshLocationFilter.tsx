import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Search, X, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import {
  SORTED_DIVISIONS,
  ALL_DISTRICTS,
  DISTRICT_ALPHABETS,
  getDistricts,
  getUpazilas,
  getDivisionOfDistrict,
  DISTRICT_TO_DIVISION_MAP
} from '../../data/bangladeshLocations';

interface PickerOption {
  id: string;
  name: string;
  subtitle?: string;
  isAllOption?: boolean;
}

interface SearchablePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  countLabel?: string;
  searchPlaceholder: string;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showAlphabetFilter?: boolean;
}

/**
 * Custom Mobile-Friendly Searchable Bottom Sheet Picker
 * Exactly matches the user's requirement: search bar & alphabet jump INSIDE the picker popup
 */
const SearchablePickerModal: React.FC<SearchablePickerModalProps> = ({
  isOpen,
  onClose,
  title,
  countLabel,
  searchPlaceholder,
  options,
  selectedValue,
  onSelect,
  showAlphabetFilter = false
}) => {
  const [search, setSearch] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset internal states when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedAlphabet('all');
      // Focus input after brief opening animation
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter options by search input and alphabet filter
  const filteredOptions = useMemo(() => {
    let list = options;
    if (selectedAlphabet !== 'all') {
      list = list.filter(opt => opt.isAllOption || opt.name.startsWith(selectedAlphabet));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        opt =>
          opt.name.toLowerCase().includes(q) ||
          (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
      );
    }
    return list;
  }, [options, search, selectedAlphabet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 transition-opacity animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet / Modal Dialog */}
      <div className="relative w-full max-h-[85vh] sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Top drag handle indicator for mobile */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{title}</h3>
              {countLabel && (
                <p className="text-[11px] text-gray-500 font-medium">{countLabel}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar INSIDE the picker */}
        <div className="p-3 bg-gray-50/80 border-b border-gray-100 space-y-2">
          <div className="flex items-center bg-white border border-gray-200 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 rounded-xl px-3 py-2 shadow-2xs transition-all">
            <Search className="w-4 h-4 text-rose-600 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400 font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Alphabet Quick Filter (অক্ষর বেধে জাম্প) inside the picker */}
          {showAlphabetFilter && (
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSelectedAlphabet('all')}
                className={`px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors text-[10px] cursor-pointer ${
                  selectedAlphabet === 'all'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                সব
              </button>
              {DISTRICT_ALPHABETS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedAlphabet(selectedAlphabet === letter ? 'all' : letter)}
                  className={`px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors text-[10px] cursor-pointer ${
                    selectedAlphabet === letter
                      ? 'bg-rose-600 text-white shadow-2xs ring-2 ring-rose-200'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Options List with circular radio buttons on the right (matches screenshot) */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 overscroll-contain">
          {filteredOptions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-bold text-gray-700">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-[11px] text-gray-400">
                "{search}" এর সাথে মিলে এমন কোনো নাম নেই
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedAlphabet('all');
                }}
                className="text-xs text-rose-600 font-bold hover:underline pt-1"
              >
                সার্চ রিসেট করুন
              </button>
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = selectedValue === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelect(opt.id);
                    onClose();
                  }}
                  className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-rose-50/40 active:bg-rose-100/50 transition-colors text-left cursor-pointer group ${
                    isSelected ? 'bg-rose-50/60' : 'bg-white'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p
                      className={`text-sm tracking-tight ${
                        isSelected
                          ? 'font-black text-rose-700'
                          : 'font-semibold text-gray-800 group-hover:text-gray-900'
                      }`}
                    >
                      {opt.name}
                    </p>
                    {opt.subtitle && (
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{opt.subtitle}</p>
                    )}
                  </div>

                  {/* Circular Radio Button on the right (identical to user's screenshot) */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-rose-600 bg-white ring-3 ring-rose-100'
                        : 'border-gray-400 bg-transparent group-hover:border-gray-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-in zoom-in-50 duration-150" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Safe bottom spacer */}
        <div className="p-2 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
          যেকোনো অপশনে ট্যাপ করলেই নির্বাচন হয়ে যাবে
        </div>
      </div>
    </div>
  );
};

interface BangladeshLocationFilterProps {
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  onChange: (division: string, district: string, upazila: string) => void;
  className?: string;
  showUpazila?: boolean;
}

export const BangladeshLocationFilter: React.FC<BangladeshLocationFilterProps> = ({
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  onChange,
  className = '',
  showUpazila = true
}) => {
  // Modal states for each picker
  const [activeModal, setActiveModal] = useState<'division' | 'district' | 'upazila' | null>(null);

  // Available districts (alphabetically sorted)
  const availableDistricts = useMemo(() => {
    return getDistricts(selectedDivision);
  }, [selectedDivision]);

  // Available upazilas (alphabetically sorted)
  const availableUpazilas = useMemo(() => {
    return getUpazilas(selectedDistrict);
  }, [selectedDistrict]);

  // Handle Division change
  const handleDivisionSelect = (division: string) => {
    if (division === 'all') {
      onChange('all', selectedDistrict !== 'all' ? selectedDistrict : 'all', 'all');
    } else {
      const districtDivision = getDivisionOfDistrict(selectedDistrict);
      const isDistrictInNewDivision = districtDivision === division;
      onChange(
        division,
        isDistrictInNewDivision ? selectedDistrict : 'all',
        isDistrictInNewDivision ? selectedUpazila : 'all'
      );
    }
  };

  // Handle District change
  const handleDistrictSelect = (district: string) => {
    if (district === 'all') {
      onChange(selectedDivision, 'all', 'all');
    } else {
      const inferredDivision = getDivisionOfDistrict(district) || selectedDivision;
      onChange(inferredDivision, district, 'all');
    }
  };

  // Handle Upazila change
  const handleUpazilaSelect = (upazila: string) => {
    onChange(selectedDivision, selectedDistrict, upazila);
  };

  // Reset all filters
  const handleReset = () => {
    onChange('all', 'all', 'all');
  };

  const hasFilter =
    selectedDivision !== 'all' || selectedDistrict !== 'all' || selectedUpazila !== 'all';

  // Build options for Division modal
  const divisionOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [
      { id: 'all', name: 'সব বিভাগ (৮টি)', isAllOption: true }
    ];
    SORTED_DIVISIONS.forEach((div) => {
      list.push({
        id: div,
        name: `${div} বিভাগ`,
        subtitle: `${(getDistricts(div)).length}টি জেলা`
      });
    });
    return list;
  }, []);

  // Build options for District modal
  const districtOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [
      {
        id: 'all',
        name: selectedDivision === 'all' ? 'সব জেলা (৬৪টি বর্ণানুক্রমে)' : `সব জেলা (${availableDistricts.length}টি)`,
        isAllOption: true
      }
    ];
    availableDistricts.forEach((dist) => {
      const divName = DISTRICT_TO_DIVISION_MAP[dist];
      const upzCount = (getUpazilas(dist)).length;
      list.push({
        id: dist,
        name: dist,
        subtitle: `${divName ? `${divName} বিভাগ • ` : ''}${upzCount}টি উপজেলা/থানা`
      });
    });
    return list;
  }, [availableDistricts, selectedDivision]);

  // Build options for Upazila modal
  const upazilaOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [
      { id: 'all', name: 'সব উপজেলা / থানা', isAllOption: true }
    ];
    availableUpazilas.forEach((upz) => {
      list.push({
        id: upz,
        name: upz,
        subtitle: `${selectedDistrict} জেলা`
      });
    });
    return list;
  }, [availableUpazilas, selectedDistrict]);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* 3 Cascading Interactive Buttons with Clean Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {/* 1. Division Selector Button */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">
            বিভাগ
          </label>
          <button
            type="button"
            onClick={() => setActiveModal('division')}
            className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100/90 active:scale-98 border border-gray-200/90 rounded-xl px-3 py-2 text-left transition-all shadow-2xs cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="block text-xs font-bold text-gray-800 truncate">
                {selectedDivision !== 'all' ? `${selectedDivision} বিভাগ` : 'সব বিভাগ (৮টি)'}
              </span>
            </div>
            <div className="flex items-center text-gray-400 group-hover:text-rose-600 transition-colors shrink-0">
              <Search className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* 2. District Selector Button */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">
            জেলা ({availableDistricts.length}টি)
          </label>
          <button
            type="button"
            onClick={() => setActiveModal('district')}
            className={`w-full flex items-center justify-between active:scale-98 border rounded-xl px-3 py-2 text-left transition-all shadow-2xs cursor-pointer group ${
              selectedDistrict !== 'all'
                ? 'bg-rose-50/50 border-rose-200 text-rose-800'
                : 'bg-gray-50 hover:bg-gray-100/90 border-gray-200/90 text-gray-800'
            }`}
          >
            <div className="min-w-0 pr-2">
              <span className="block text-xs font-bold truncate">
                {selectedDistrict !== 'all'
                  ? selectedDistrict
                  : selectedDivision === 'all'
                  ? 'সব জেলা (৬৪টি বর্ণানুক্রমে)'
                  : `সব জেলা (${availableDistricts.length}টি)`}
              </span>
            </div>
            <div className="flex items-center text-gray-400 group-hover:text-rose-600 transition-colors shrink-0">
              <Search className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* 3. Upazila Selector Button */}
        {showUpazila && (
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">
              উপজেলা / থানা
            </label>
            <button
              type="button"
              disabled={selectedDistrict === 'all'}
              onClick={() => setActiveModal('upazila')}
              className={`w-full flex items-center justify-between border rounded-xl px-3 py-2 text-left transition-all ${
                selectedDistrict === 'all'
                  ? 'bg-gray-100/60 border-gray-200/60 text-gray-400 cursor-not-allowed'
                  : selectedUpazila !== 'all'
                  ? 'bg-rose-50/50 border-rose-200 text-rose-800 cursor-pointer active:scale-98 shadow-2xs'
                  : 'bg-gray-50 hover:bg-gray-100/90 border-gray-200/90 text-gray-800 cursor-pointer active:scale-98 shadow-2xs group'
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className="block text-xs font-bold truncate">
                  {selectedDistrict === 'all'
                    ? 'আগে জেলা নির্বাচন করুন'
                    : selectedUpazila !== 'all'
                    ? selectedUpazila
                    : `সব উপজেলা (${availableUpazilas.length}টি)`}
                </span>
              </div>
              <div className="flex items-center text-gray-400 group-hover:text-rose-600 transition-colors shrink-0">
                {selectedDistrict !== 'all' && (
                  <Search className="w-3.5 h-3.5 mr-1 text-gray-400" />
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Active Breadcrumb & 1-Click Reset */}
      {hasFilter && (
        <div className="flex items-center justify-between text-[11px] text-gray-600 bg-rose-50/80 border border-rose-100 rounded-xl px-3 py-1.5 animate-in fade-in duration-150">
          <div className="flex items-center space-x-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="font-bold text-gray-800 truncate">
              {selectedDivision !== 'all' ? `${selectedDivision} বিভাগ` : 'সব বিভাগ'}
              {selectedDistrict !== 'all' && ` > ${selectedDistrict}`}
              {selectedUpazila !== 'all' && ` > ${selectedUpazila}`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 font-bold text-[11px] shrink-0 ml-2 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ফিল্টার রিসেট</span>
          </button>
        </div>
      )}

      {/* ================= SEARCHABLE MODAL PICKERS (সার্চ এসবের ভিতরে) ================= */}

      {/* 1. Division Searchable Picker */}
      <SearchablePickerModal
        isOpen={activeModal === 'division'}
        onClose={() => setActiveModal(null)}
        title="বিভাগ নির্বাচন করুন"
        countLabel="৮টি বিভাগ (বর্ণানুক্রমে)"
        searchPlaceholder="বিভাগ সার্চ করুন... (যেমন: ঢাকা, চট্টগ্রাম)"
        options={divisionOptions}
        selectedValue={selectedDivision}
        onSelect={handleDivisionSelect}
      />

      {/* 2. District Searchable Picker */}
      <SearchablePickerModal
        isOpen={activeModal === 'district'}
        onClose={() => setActiveModal(null)}
        title="জেলা নির্বাচন করুন"
        countLabel={
          selectedDivision === 'all'
            ? '৬৪টি জেলা (বর্ণানুক্রমে সাজানো)'
            : `${selectedDivision} বিভাগ (${availableDistricts.length}টি জেলা)`
        }
        searchPlaceholder="জেলা সার্চ করুন... (যেমন: বগুড়া, কুমিল্লা, দিনাজপুর)"
        options={districtOptions}
        selectedValue={selectedDistrict}
        onSelect={handleDistrictSelect}
        showAlphabetFilter={true}
      />

      {/* 3. Upazila Searchable Picker */}
      <SearchablePickerModal
        isOpen={activeModal === 'upazila'}
        onClose={() => setActiveModal(null)}
        title={`${selectedDistrict} জেলার উপজেলা / থানা`}
        countLabel={`${availableUpazilas.length}টি উপজেলা/থানা (বর্ণানুক্রমে সাজানো)`}
        searchPlaceholder="উপজেলা বা থানা সার্চ করুন... (যেমন: মিরপুর, লাকসাম)"
        options={upazilaOptions}
        selectedValue={selectedUpazila}
        onSelect={handleUpazilaSelect}
      />
    </div>
  );
};
