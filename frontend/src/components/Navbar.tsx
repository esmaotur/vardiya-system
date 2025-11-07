import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-pink-500 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Vardiya Sistemi</h1>
        <div>
          <Link href="/" className="mx-4 hover:text-gray-300">Anasayfa</Link>
          <Link href="/employees" className="mx-4 hover:text-gray-300">Çalışanlar</Link>
          <Link href="/shifts" className="mx-4 hover:text-gray-300">Vardiyalar</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
