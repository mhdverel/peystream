'use client';

import Link from 'next/link';
import { useState } from 'react';

// Navbar component dengan navigation lengkap
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <div className="absolute -inset-1 bg-red-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-white font-bold text-xl md:text-2xl tracking-tight">
                            Pey<span className="text-red-500">stream</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-white/80 hover:text-white font-medium transition-colors"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/category/dramabox"
                            className="text-white/80 hover:text-white font-medium transition-colors"
                        >
                            DramaBox
                        </Link>
                        <Link
                            href="/category/netshort"
                            className="text-white/80 hover:text-white font-medium transition-colors"
                        >
                            NetShort
                        </Link>
                        <Link
                            href="/category/melolo"
                            className="text-white/80 hover:text-white font-medium transition-colors"
                        >
                            Melolo
                        </Link>
                    </div>

                    {/* Search & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 text-white/80 hover:text-white transition-colors"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div className="pb-4 animate-fadeIn">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari drama..."
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 animate-fadeIn">
                        <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-lg rounded-xl p-4">
                            <Link
                                href="/"
                                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/category/dramabox"
                                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                DramaBox
                            </Link>
                            <Link
                                href="/category/netshort"
                                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                NetShort
                            </Link>
                            <Link
                                href="/category/melolo"
                                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Melolo
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
