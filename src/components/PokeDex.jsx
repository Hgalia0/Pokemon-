import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Heart, ChevronLeft, ChevronRight, X, Shield, Zap, Heart as HeartIcon } from 'lucide-react';

const TYPE_COLORS = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400 text-black',
  grass: 'bg-green-500',
  ice: 'bg-blue-200 text-black',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300 text-black',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300 text-black',
};

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const limit = 20;

useEffect(() => {
  const fetchPokemon = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const results = response.data.results;

      const detailedData = await Promise.all(
        results.map(async (p) => {
          const res = await axios.get(p.url);
          return res.data;
        })
      );

      setPokemonList(detailedData);
    } catch (error) {
      console.error("Erreur lors du chargement des Pokémon:", error);
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  if (!search) {
    fetchPokemon();
  }
}, [offset, search]);








  // Recherche directe via l'API
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`);
      setPokemonList([res.data]);
    } catch (error) {
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des favoris
  const toggleFavorite = (pokemon) => {
    if (favorites.some((fav) => fav.id === pokemon.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== pokemon.id));
    } else {
      setFavorites([...favorites, pokemon]);
    }
  };

  const displayedList = showFavoritesOnly ? favorites : pokemonList;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-red-500 tracking-wider flex items-center gap-2">
            Pokédex
          </h1>

          {/* Search Bar & Favorite Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Nom ou ID du Pokémon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 border border-slate-700"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-2.5 rounded-xl border transition ${
                showFavoritesOnly
                  ? 'bg-red-500/20 border-red-500 text-red-500'
                  : 'bg-slate-800 border-slate-700 text-gray-300 hover:text-white'
              }`}
              title="Voir les Favoris"
            >
              <Heart size={20} className={showFavoritesOnly ? 'fill-red-500' : ''} />
            </button>
          </div>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Aucun Pokémon trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedList.map((pokemon) => {
              const isFav = favorites.some((fav) => fav.id === pokemon.id);
              return (
                <div
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center relative cursor-pointer hover:scale-105 hover:border-red-500/50 transition duration-200 shadow-lg group"
                >
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pokemon);
                    }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10"
                  >
                    <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                  </button>

                  <span className="self-start text-xs font-bold text-gray-500">
                    #{String(pokemon.id).padStart(3, '0')}
                  </span>

                  <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain my-2 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] transition"
                  />

                  <h2 className="text-xl font-bold capitalize mb-2">{pokemon.name}</h2>

                  {/* Types */}
                  <div className="flex gap-2">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                          TYPE_COLORS[t.type.name] || 'bg-gray-600'
                        }`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!showFavoritesOnly && !search && (
          <div className="flex justify-between items-center mt-8">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} /> Précédent
            </button>

            <span className="text-sm text-gray-400">
              Page {offset / limit + 1}
            </span>

            <button
              onClick={() => setOffset(offset + limit)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition"
            >
              Suivant <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Modal Détails du Pokémon */}
        {selectedPokemon && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPokemon(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-500 mb-1">
                  #{String(selectedPokemon.id).padStart(3, '0')}
                </span>
                <h2 className="text-3xl font-extrabold capitalize mb-4">{selectedPokemon.name}</h2>

                <img
                  src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="w-44 h-44 object-contain mb-4"
                />

                <div className="flex gap-2 mb-6">
                  {selectedPokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                        TYPE_COLORS[t.type.name] || 'bg-gray-600'
                      }`}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>

                {/* Mesures */}
                <div className="grid grid-cols-2 gap-4 w-full bg-slate-900/50 p-4 rounded-xl mb-6 text-center">
                  <div>
                    <span className="text-xs text-gray-400 block">Taille</span>
                    <span className="text-lg font-bold">{selectedPokemon.height / 10} m</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Poids</span>
                    <span className="text-lg font-bold">{selectedPokemon.weight / 10} kg</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full">
                  <h3 className="text-lg font-bold mb-3 text-left">Statistiques</h3>
                  <div className="space-y-3">
                    {selectedPokemon.stats.map((stat) => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-xs mb-1 capitalize text-gray-300">
                          <span>{stat.stat.name}</span>
                          <span className="font-bold">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (stat.base_stat / 150) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}