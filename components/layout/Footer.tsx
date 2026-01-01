import Link from 'next/link';

// Footer component dengan links dan branding
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-t from-black via-[#0a0a0a] to-transparent mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-white font-bold text-2xl">
                                Pey<span className="text-red-500">stream</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                            Peystream adalah platform streaming drama China terbaik di Indonesia.
                            Nikmati ribuan episode drama pendek dan serial dengan kualitas terbaik,
                            termasuk drama dengan sulih suara Bahasa Indonesia.
                        </p>
                    </div>

                    {/* Kategori */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Kategori</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/category/dramabox" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    DramaBox
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/netshort" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    NetShort
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/melolo" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    Melolo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Jelajahi</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/#trending" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    Trending
                                </Link>
                            </li>
                            <li>
                                <Link href="/#latest" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    Terbaru
                                </Link>
                            </li>
                            <li>
                                <Link href="/#dubbed" className="text-white/60 hover:text-red-400 text-sm transition-colors">
                                    Sulih Suara
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm">
                        © {currentYear} Peystream. Dibuat dengan ❤️ di Indonesia.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-white/40 text-xs">
                            Powered by Sansekai API
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
