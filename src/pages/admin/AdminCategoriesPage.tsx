import React, { useState } from 'react';
import { FolderTree, Plus, Trash2, Tag, Globe } from 'lucide-react';
import { GENRES_LIST, LANGUAGES_LIST } from '../../data/seedMovies';
import { useMovies } from '../../context/MoviesContext';

export const AdminCategoriesPage: React.FC = () => {
  const { movies } = useMovies();
  const [genres, setGenres] = useState<string[]>(GENRES_LIST);
  const [languages, setLanguages] = useState<string[]>(LANGUAGES_LIST);
  const [newGenre, setNewGenre] = useState('');
  const [newLang, setNewLang] = useState('');

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre('');
    }
  };

  const handleAddLang = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLang.trim() && !languages.includes(newLang.trim())) {
      setLanguages([...languages, newLang.trim()]);
      setNewLang('');
    }
  };

  const handleDeleteGenre = (item: string) => {
    setGenres(genres.filter((g) => g !== item));
  };

  const handleDeleteLang = (item: string) => {
    setLanguages(languages.filter((l) => l !== item));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Categories &amp; Taxonomy
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Manage genres and supported languages for filtering and cataloging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Genres Column */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-red-500" />
              Movie Genres ({genres.length})
            </h2>
          </div>

          <form onSubmit={handleAddGenre} className="flex gap-2">
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="e.g. Documentary, Noir..."
              className="flex-1 bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {genres.map((g) => {
              const count = movies.filter((m) => m.genres.includes(g)).length;
              return (
                <div
                  key={g}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{g}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">({count} titles)</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGenre(g)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Delete Genre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Languages Column */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Supported Languages ({languages.length})
            </h2>
          </div>

          <form onSubmit={handleAddLang} className="flex gap-2">
            <input
              type="text"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              placeholder="e.g. French, Japanese..."
              className="flex-1 bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {languages.map((l) => {
              const count = movies.filter((m) => m.language.toLowerCase() === l.toLowerCase()).length;
              return (
                <div
                  key={l}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{l}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">({count} titles)</span>
                  </div>
                  <button
                    onClick={() => handleDeleteLang(l)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Delete Language"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
