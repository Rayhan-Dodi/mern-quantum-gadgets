import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  ChevronDown,
  Menu,
  X,
  Search as SearchIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import { useState, useRef } from "react";

const dropdowns = [
  {
    name: "Desktop",
    categories: [
      { href: "/category/processors", name: "Processors (CPU)" },
      { href: "/category/motherboard", name: "Motherboards" },
      { href: "/category/ram", name: "RAM" },
      { href: "/category/graphics-cards", name: "Graphics Cards (GPU)" },
      { href: "/category/cases", name: "PC Cases" },
    ],
  },
  {
    name: "Peripherals",
    categories: [
      { href: "/category/monitors", name: "Monitors" },
      { href: "/category/keyboards", name: "Keyboards" },
      { href: "/category/mouse", name: "Mouse" },
      { href: "/category/speakers", name: "Speakers" },
      { href: "/category/headphones", name: "Headphones" },
    ],
  },
  {
    name: "Gaming",
    categories: [
      { href: "/category/consoles", name: "Consoles" },
      { href: "/category/gaming-chairs", name: "Gaming Chairs" },
      { href: "/category/controllers", name: "Controllers" },
      { href: "/category/vr", name: "VR Headsets" },
      { href: "/category/streaming", name: "Streaming Gear" },
    ],
  },
  {
    name: "Networking",
    categories: [
      { href: "/category/routers", name: "Routers" },
      { href: "/category/switches", name: "Switches" },
      { href: "/category/network-cards", name: "Network Cards" },
      { href: "/category/modems", name: "Modems" },
      { href: "/category/access-points", name: "Access Points" },
    ],
  },
  {
    name: "Accessories",
    categories: [
      { href: "/category/bags", name: "Laptop Bags" },
      { href: "/category/cables", name: "Cables" },
      { href: "/category/power-banks", name: "Power Banks" },
      { href: "/category/adapters", name: "Adapters" },
      { href: "/category/hubs", name: "USB Hubs" },
    ],
  },
  {
    name: "Office",
    categories: [
      { href: "/category/printers", name: "Printers" },
      { href: "/category/scanners", name: "Scanners" },
      { href: "/category/webcams", name: "Webcams" },
      { href: "/category/microphones", name: "Microphones" },
      { href: "/category/projectors", name: "Projectors" },
    ],
  },
];

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const { products } = useProductStore();

  // Dropdown state
  const [open, setOpen] = useState(Array(dropdowns.length).fill(false));
  const closeTimeout = useRef(null);

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(
    Array(dropdowns.length).fill(false)
  );

  // Search bar state
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Filter products by name (case-insensitive, simple match)
  const filteredProducts =
    searchTerm.length > 0
      ? products
          .filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 7) // Limit results
      : [];

  // Hide dropdown on click outside
  const handleSearchBlur = () => {
    setTimeout(() => setShowSearch(false), 100); // delay to allow click
  };

  // Navigate to product details and close search
  const handleResultClick = (id) => {
    setSearchTerm("");
    setShowSearch(false);
    navigate(`/product/${id}`);
  };

  // Hover handlers (desktop)
  const handleMouseEnter = (idx) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen((prev) => prev.map((v, i) => (i === idx ? true : false)));
  };
  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpen(Array(dropdowns.length).fill(false));
    }, 150);
  };

  // Mobile dropdown toggle
  const handleMobileDropdown = (idx) => {
    setMobileDropdownOpen((prev) =>
      prev.map((v, i) => (i === idx ? !v : false))
    );
  };

  // Close menu on navigation (mobile)
  const handleMobileNav = () => {
    setMobileOpen(false);
    setMobileDropdownOpen(Array(dropdowns.length).fill(false));
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-blue-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-2">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 flex items-center gap-2"
          >
            QuantumGadgets
          </Link>
          {/* Search Bar (Desktop Only) */}
          <div className="hidden sm:block relative w-72">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg bg-gray-800 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                onBlur={handleSearchBlur}
                ref={searchRef}
              />
              <SearchIcon
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {/* Dropdown results */}
            {showSearch && filteredProducts.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-gray-800 border border-blue-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    className="w-full text-left px-4 py-2 hover:bg-blue-800 hover:text-blue-200 text-gray-200 flex gap-2 items-center"
                    onMouseDown={() => handleResultClick(product._id)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <span>{product.name}</span>
                  </button>
                ))}
                {filteredProducts.length === 7 && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    More results exist, refine your search...
                  </div>
                )}
              </div>
            )}
            {/* No results */}
            {showSearch && searchTerm && filteredProducts.length === 0 && (
              <div className="absolute left-0 mt-2 w-full bg-gray-800 border border-blue-700 rounded-lg shadow-lg z-50 px-4 py-2 text-gray-400">
                No products found.
              </div>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button
            className="sm:hidden p-2 rounded-md text-blue-400 hover:bg-blue-800 transition"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          {/* Desktop Nav */}
          <nav className="hidden sm:flex flex-wrap items-center gap-2 sm:gap-4 relative">
            {dropdowns.map((menu, idx) => (
              <div
                className="relative"
                key={menu.name}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200 font-medium"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={open[idx]}
                >
                  {menu.name} <ChevronDown size={16} />
                </button>
                {open[idx] && (
                  <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-blue-700 rounded-lg shadow-lg py-2 z-50">
                    {menu.categories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.href}
                        className="block px-4 py-2 text-gray-200 hover:bg-blue-800 hover:text-blue-200 transition-colors"
                        onClick={() =>
                          setOpen(Array(dropdowns.length).fill(false))
                        }
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {user && (
              <Link
                to={"/cart"}
                className="relative px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200 font-medium flex items-center"
              >
                <ShoppingCart className="inline-block mr-1" size={20} />
                {cart.length > 0 && (
                  <span className="absolute top-0 left-5 sm:left-6 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold shadow group-hover:bg-blue-400 transition">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-semibold shadow transition"
              >
                <Lock size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                onClick={logout}
              >
                <LogOut size={18} />
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`sm:hidden fixed top-[64px] left-0 w-full bg-gray-900 bg-opacity-95 shadow-lg z-40 transition-all duration-300
        ${
          mobileOpen
            ? "max-h-[90vh] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }
        overflow-y-auto`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {/* Mobile search bar */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              className="w-full rounded-lg bg-gray-800 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              onBlur={handleSearchBlur}
            />
            <SearchIcon
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {/* Dropdown results */}
            {showSearch && filteredProducts.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-gray-800 border border-blue-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    className="w-full text-left px-4 py-2 hover:bg-blue-800 hover:text-blue-200 text-gray-200 flex gap-2 items-center"
                    onMouseDown={() => {
                      handleResultClick(product._id);
                      handleMobileNav();
                    }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <span>{product.name}</span>
                  </button>
                ))}
                {filteredProducts.length === 7 && (
                  <div className="px-4 py-2 text-xs text-gray-400">
                    More results exist, refine your search...
                  </div>
                )}
              </div>
            )}
            {/* No results */}
            {showSearch && searchTerm && filteredProducts.length === 0 && (
              <div className="absolute left-0 mt-2 w-full bg-gray-800 border border-blue-700 rounded-lg shadow-lg z-50 px-4 py-2 text-gray-400">
                No products found.
              </div>
            )}
          </div>
          {dropdowns.map((menu, idx) => (
            <div key={menu.name} className="flex flex-col">
              <button
                className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200 font-medium"
                type="button"
                aria-haspopup="true"
                aria-expanded={mobileDropdownOpen[idx]}
                onClick={() => handleMobileDropdown(idx)}
              >
                <span className="flex items-center gap-1">
                  {menu.name}{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      mobileDropdownOpen[idx] ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
              {mobileDropdownOpen[idx] && (
                <div className="flex flex-col w-full bg-gray-800 border border-blue-700 rounded-lg shadow-lg py-1 mb-2 mt-1">
                  {menu.categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.href}
                      className="block px-4 py-2 text-gray-200 hover:bg-blue-800 hover:text-blue-200 transition-colors"
                      onClick={handleMobileNav}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {user && (
            <Link
              to={"/cart"}
              className="relative px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-900 hover:text-blue-300 transition-colors duration-200 font-medium flex items-center"
              onClick={handleMobileNav}
            >
              <ShoppingCart className="inline-block mr-1" size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 left-5 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold shadow group-hover:bg-blue-400 transition">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-semibold shadow transition"
              onClick={handleMobileNav}
            >
              <Lock size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
              onClick={() => {
                logout();
                handleMobileNav();
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                onClick={handleMobileNav}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                onClick={handleMobileNav}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
