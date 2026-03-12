function Footer({ isNight }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 mb-10 px-8 transition-all duration-500">
      <div className="max-w-[1400px] mx-auto">

        {/* Divider */}
        <div
          className={`w-full h-[1px] mb-6 ${
            isNight
              ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
              : "bg-gradient-to-r from-transparent via-black/20 to-transparent"
          }`}
        />

        {/* Brand */}
        <div className="flex justify-center items-center">
          <p
            className={`text-sm font-semibold tracking-wide ${
              isNight ? "text-white" : "text-black"
            }`}
          >
            © {year} SkyCast
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;