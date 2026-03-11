function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 backdrop-blur-md">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold">
          SkyCast
        </h1>

        <p className="text-sm opacity-70">
          Intelligent Weather Dashboard
        </p>

      </div>

    </nav>
  );
}

export default Navbar;