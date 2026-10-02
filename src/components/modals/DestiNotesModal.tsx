import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Plus,
  Search,
  Pin,
  Trash2,
  Copy,
  Check,
  Edit3,
  ArrowLeft,
  CheckSquare,
  Square,
  Sparkles,
  Share2,
} from 'lucide-react';

export interface DestiNote {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'todo' | 'finance' | 'medical' | 'personal';
  isPinned: boolean;
  checklist?: { id: string; text: string; done: boolean }[];
  createdAt: string;
  updatedAt: string;
}

interface DestiNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

// Clean, short single-word categories
const CATEGORIES: {
  id: DestiNote['category'];
  label: string;
}[] = [
  { id: 'work', label: 'অফিস' },
  { id: 'todo', label: 'চেকলিস্ট' },
  { id: 'finance', label: 'হিসাব' },
  { id: 'medical', label: 'মেডিকেল' },
  { id: 'personal', label: 'ব্যক্তিগত' },
];

// Minimal in-editor templates (doesn't clutter main screen)
const TEMPLATES = [
  {
    name: 'কাজের চেকলিস্ট',
    category: 'todo' as const,
    title: 'দৈনিক কাজের তালিকা',
    content: '',
    checklist: [
      { id: '1', text: 'জরুরি ইমেইল ও মেসেজ রিভিউ', done: true },
      { id: '2', text: 'মিটিং এজেন্ডা ফাইনাল করা', done: false },
      { id: '3', text: 'প্রজেক্ট রিপোর্ট সাবমিট করা', done: false },
    ],
  },
  {
    name: 'মিটিং নোটস (MoM)',
    category: 'work' as const,
    title: 'টিম মিটিং নোটস',
    content: `তারিখ: ${new Date().toLocaleDateString('bn-BD')}

আলোচনার বিষয়:
• এজেন্ডা ও অগ্রগতি
• সিদ্ধান্ত ও দায়িত্ব বণ্টন

পরবর্তী পদক্ষেপ:
• আগামী সপ্তাহের মধ্যে টাস্ক সম্পন্ন করা`,
    checklist: [],
  },
  {
    name: 'হিসাব ও লেনদেন',
    category: 'finance' as const,
    title: 'চলতি মাসের হিসাব',
    content: `আয় / বাজেট:
ব্যয় বিবরণী:
বকেয়া / প্রাপ্য:`,
    checklist: [],
  },
  {
    name: 'প্রেসক্রিপশন ও ওষুধ',
    category: 'medical' as const,
    title: 'চিকিৎসা ও ওষুধের তালিকা',
    content: `ডাক্তারের নাম:
ওষুধের নিয়ম:
পরবর্তী টেস্ট ও ফলোআপ তারিখ:`,
    checklist: [],
  },
];

const INITIAL_NOTES: DestiNote[] = [
  {
    id: 'n1',
    title: 'অফিস মিটিং ও কাজের পরিকল্পনা',
    content: 'চলতি সপ্তাহের মূল লক্ষ্য এবং বিভিন্ন প্রজেক্ট ডেলিভারি টাইমলাইন সমন্বয়।',
    category: 'work',
    isPinned: true,
    checklist: [
      { id: 'c1', text: 'সাপ্তাহিক প্রোগ্রেস শিট আপডেট করা', done: true },
      { id: 'c2', text: 'ক্লায়েন্ট ফিডব্যাক পর্যালোচনা', done: false },
      { id: 'c3', text: 'টিমের সাথে ব্রিফিং সম্পন্ন করা', done: false },
    ],
    createdAt: 'আজ, ৯:১৫ AM',
    updatedAt: 'আজ, ৯:১৫ AM',
  },
  {
    id: 'n2',
    title: 'জরুরি প্রেসক্রিপশন ও চেকআপ',
    content: 'ডাক্তারের পরামর্শ অনুযায়ী নিয়মিত ওষুধ গ্রহণ এবং আগামী সপ্তাহের রুটিন ল্যাব টেস্ট।',
    category: 'medical',
    isPinned: true,
    checklist: [
      { id: 'c4', text: 'সকাল ও রাতের ওষুধ নিয়মিত খাওয়া', done: true },
      { id: 'c5', text: 'ব্লাড টেস্ট রিপোর্ট সংগ্রহ', done: false },
    ],
    createdAt: 'গতকাল, ৭:৩০ PM',
    updatedAt: 'গতকাল, ৭:৩০ PM',
  },
  {
    id: 'n3',
    title: 'প্রজেক্ট খরচ ও বাজেট নোট',
    content: 'লজিস্টিকস ও ফিল্ড টিমের সহায়তার জন্য আনুমানিক বাজেট বরাদ্দ ও ভাউচার সংগ্রহ।',
    category: 'finance',
    isPinned: false,
    checklist: [],
    createdAt: '২৫ সেপ্টেম্বর',
    updatedAt: '২৫ সেপ্টেম্বর',
  },
];

export const DestiNotesModal: React.FC<DestiNotesModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { l, isEn } = useLanguage();
  const [notes, setNotes] = useState<DestiNote[]>(() => {
    try {
      const saved = localStorage.getItem('destihope_clean_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | DestiNote['category']>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editor states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<DestiNote['category']>('work');
  const [noteIsPinned, setNoteIsPinned] = useState(false);
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsEditorOpen(false);
      setEditingNoteId(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('destihope_clean_notes', JSON.stringify(notes));
  }, [notes]);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const handleOpenBlankNote = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('work');
    setNoteIsPinned(false);
    setChecklistItems([]);
    setNewChecklistText('');
    setIsEditorOpen(true);
  };

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setNoteTitle(tmpl.title);
    setNoteContent(tmpl.content);
    setNoteCategory(tmpl.category);
    setChecklistItems(tmpl.checklist.map((c) => ({ ...c, id: `${Date.now()}-${Math.random()}` })));
    notify('টেমপ্লেট যুক্ত হয়েছে');
  };

  const handleEditNote = (note: DestiNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteIsPinned(note.isPinned);
    setChecklistItems(note.checklist || []);
    setNewChecklistText('');
    setIsEditorOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim() && checklistItems.length === 0) {
      notify('নোটের শিরোনাম বা বিবরণ লিখুন');
      return;
    }

    const nowStr = new Date().toLocaleDateString('bn-BD', {
      month: 'short',
      day: 'numeric',
    });

    if (editingNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNoteId
            ? {
                ...n,
                title: noteTitle.trim() || 'শিরোনামহীন নোট',
                content: noteContent.trim(),
                category: noteCategory,
                isPinned: noteIsPinned,
                checklist: checklistItems,
                updatedAt: nowStr,
              }
            : n
        )
      );
      notify('সংরক্ষিত হয়েছে');
    } else {
      const newNote: DestiNote = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim() || 'নতুন নোট',
        content: noteContent.trim(),
        category: noteCategory,
        isPinned: noteIsPinned,
        checklist: checklistItems,
        createdAt: nowStr,
        updatedAt: nowStr,
      };
      setNotes((prev) => [newNote, ...prev]);
      notify('নতুন নোট তৈরি হয়েছে');
    }

    setIsEditorOpen(false);
    setEditingNoteId(null);
  };

  const handleToggleChecklistItem = (noteId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId || !n.checklist) return n;
        const updated = n.checklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        return { ...n, checklist: updated };
      })
    );
  };

  const handleAddChecklistInsideEditor = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: `${Date.now()}`, text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistInsideEditor = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    notify('নোট মুছে ফেলা হয়েছে');
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleCopyNote = (note: DestiNote, e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = `${note.title}\n\n${note.content}`;
    if (note.checklist && note.checklist.length > 0) {
      textToCopy += '\n\n' + note.checklist.map((c) => `${c.done ? '[✓]' : '[ ]'} ${c.text}`).join('\n');
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    notify('কপি হয়েছে');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered notes (pinned on top)
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (activeFilter === 'pinned' && !n.isPinned) return false;
        if (activeFilter !== 'all' && activeFilter !== 'pinned' && n.category !== activeFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.checklist?.some((c) => c.text.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [notes, activeFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] text-gray-900 overflow-hidden animate-in fade-in duration-150 font-sans"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. ULTRA-CLEAN APP HEADER (Apple Notes / Bear Style) */}
      <header className="shrink-0 bg-white border-b border-gray-200/80">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label={l('ফিরে যান', 'Go Back')}
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                Desti Notes
              </h1>
              <p className="text-[11px] text-gray-400 font-medium">
                {notes.length}টি নোট সংরক্ষিত
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenBlankNote}
              className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>নতুন</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label={l('বন্ধ করুন', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. MINIMAL SEARCH & PILLS */}
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নোট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/90 border border-transparent focus:border-gray-300 focus:bg-white pl-10 pr-9 py-2 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Simple, sleek category pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              সব
            </button>

            <button
              onClick={() => setActiveFilter('pinned')}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer ${
                activeFilter === 'pinned'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>পিন করা</span>
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. CLEAN NOTES LISTING (No cluttered banners!) */}
      <main className="flex-1 overflow-y-auto px-4 py-3 max-w-2xl mx-auto w-full space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-xs text-gray-400 font-medium">কোনো নোট নেই</p>
            <button
              onClick={handleOpenBlankNote}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-black cursor-pointer active:scale-95"
            >
              + নতুন নোট লিখুন
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotes.map((note) => {
              const catObj = CATEGORIES.find((c) => c.id === note.category) || CATEGORIES[0];
              const totalItems = note.checklist?.length || 0;
              const doneItems = note.checklist?.filter((c) => c.done).length || 0;

              return (
                <div
                  key={note.id}
                  onClick={() => handleEditNote(note)}
                  className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all cursor-pointer space-y-2.5 relative group"
                >
                  {/* Top Bar: Title & Pin */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                      {note.title}
                    </h2>

                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(note.id, e)}
                      className="p-1 -mr-1 text-gray-300 hover:text-amber-500 rounded-md transition-colors cursor-pointer shrink-0"
                      title={note.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
                    >
                      <Pin
                        className={`w-3.5 h-3.5 ${
                          note.isPinned ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Body Content Excerpt */}
                  {note.content && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                  )}

                  {/* Clean Interactive Checklist (No messy progress bars) */}
                  {totalItems > 0 && (
                    <div className="space-y-1 pt-1">
                      {note.checklist?.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={(e) => handleToggleChecklistItem(note.id, item.id, e)}
                          className="flex items-center space-x-2 py-0.5 text-xs text-gray-700 hover:text-black transition-colors"
                        >
                          <button type="button" className="shrink-0 text-gray-400">
                            {item.done ? (
                              <CheckSquare className="w-3.5 h-3.5 text-gray-900" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>
                          <span
                            className={`truncate text-xs ${
                              item.done ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                      {totalItems > 3 && (
                        <p className="text-[10px] text-gray-400 pt-0.5 font-medium">
                          + আরও {totalItems - 3}টি আইটেম... ({doneItems}/{totalItems})
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bottom Meta */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-400">{note.updatedAt}</span>
                      <span>•</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold">
                        {catObj.label}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopyNote(note, e)}
                        className="p-1.5 text-gray-400 hover:text-black rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        title="কপি করুন"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. CLEAN NATIVE EDITOR MODAL */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">
                {editingNoteId ? 'নোট সম্পাদনা' : 'নতুন নোট'}
              </h3>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Dropdown inside Editor (clean & non-intrusive) */}
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[10.5px] font-bold text-gray-400 whitespace-nowrap mr-1">
                টেমপ্লেট:
              </span>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 whitespace-nowrap font-medium cursor-pointer transition-colors"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNote} className="space-y-3 flex-1 overflow-y-auto pr-1">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="শিরোনাম লিখুন..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 focus:border-black focus:outline-none placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {/* Category & Pin Selection */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-500 font-medium">ক্যাটেগরি:</span>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="bg-gray-100 text-xs text-gray-800 rounded-lg px-2.5 py-1 font-medium border-none focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setNoteIsPinned(!noteIsPinned)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                    noteIsPinned
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Pin className={`w-3 h-3 ${noteIsPinned ? 'fill-amber-600' : ''}`} />
                  <span>{noteIsPinned ? 'পিন করা' : 'পিন করুন'}</span>
                </button>
              </div>

              {/* Main Text Content */}
              <div>
                <textarea
                  rows={6}
                  placeholder="বিস্তারিত নোট লিখুন..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white resize-none"
                />
              </div>

              {/* Checklist Builder */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-gray-500">কাজের চেকলিস্ট</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="নতুন টাস্ক বা চেকলিস্ট..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistInsideEditor();
                      }
                    }}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistInsideEditor}
                    className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
                  >
                    যোগ
                  </button>
                </div>

                {checklistItems.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                    {checklistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                      >
                        <div
                          onClick={() => {
                            setChecklistItems((prev) =>
                              prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c))
                            );
                          }}
                          className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0"
                        >
                          {item.done ? (
                            <CheckSquare className="w-3.5 h-3.5 text-gray-900" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span
                            className={`truncate text-xs ${
                              item.done ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistInsideEditor(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
