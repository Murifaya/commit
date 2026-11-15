import { useState, useMemo, useEffect } from "react";
import {
  Wallet, Store, Search, ShoppingBag, Clock, Plus, Minus, X, Check,
  ChefHat, PackageCheck, Receipt, Trash2, Star, BellRing, SlidersHorizontal, UtensilsCrossed,
} from "lucide-react";

const KIOS = [
  { id: "k1", name: "Warung Bu Tini", desc: "Masakan rumahan", eta: 10, open: true, emoji: "🍛" },
  { id: "k2", name: "Kopi Pojok", desc: "Kopi & minuman dingin", eta: 5, open: true, emoji: "☕" },
  { id: "k3", name: "Mie & Bakso Pak Joko", desc: "Mie, bakso, soto", eta: 12, open: true, emoji: "🍜" },
  { id: "k4", name: "Snack Corner", desc: "Gorengan & camilan", eta: 5, open: false, emoji: "🍟" },
];

const MENU = [
  { id: 1, k: "k1", name: "Nasi Ayam Geprek", price: 15000, cat: "Makanan", emoji: "🍗", rate: 4.8 },
  { id: 2, k: "k1", name: "Nasi Rames", price: 12000, cat: "Makanan", emoji: "🍛", rate: 4.5 },
  { id: 3, k: "k1", name: "Nasi Telur Balado", price: 10000, cat: "Makanan", emoji: "🍳", rate: 4.4 },
  { id: 4, k: "k1", name: "Es Teh Manis", price: 4000, cat: "Minuman", emoji: "🧋", rate: 4.6 },
  { id: 5, k: "k2", name: "Kopi Susu Gula Aren", price: 14000, cat: "Minuman", emoji: "☕", rate: 4.9 },
  { id: 6, k: "k2", name: "Matcha Latte", price: 17000, cat: "Minuman", emoji: "🍵", rate: 4.5 },
  { id: 7, k: "k2", name: "Es Jeruk Peras", price: 8000, cat: "Minuman", emoji: "🍊", rate: 4.3 },
  { id: 8, k: "k2", name: "Roti Bakar Cokelat", price: 11000, cat: "Camilan", emoji: "🍞", rate: 4.7 },
  { id: 9, k: "k3", name: "Mie Ayam Bakso", price: 16000, cat: "Makanan", emoji: "🍜", rate: 4.8 },
  { id: 10, k: "k3", name: "Bakso Urat Jumbo", price: 18000, cat: "Makanan", emoji: "🥣", rate: 4.7 },
  { id: 11, k: "k3", name: "Soto Ayam", price: 13000, cat: "Makanan", emoji: "🍲", rate: 4.4 },
  { id: 12, k: "k3", name: "Es Campur", price: 9000, cat: "Minuman", emoji: "🍧", rate: 4.2 },
  { id: 13, k: "k4", name: "Tahu Crispy", price: 5000, cat: "Camilan", emoji: "🍢", rate: 4.3 },
  { id: 14, k: "k4", name: "Kentang Goreng", price: 8000, cat: "Camilan", emoji: "🍟", rate: 4.5 },
  { id: 15, k: "k4", name: "Pisang Goreng Keju", price: 7000, cat: "Camilan", emoji: "🍌", rate: 4.6 },
  { id: 16, k: "k4", name: "Cilok Kuah", price: 6000, cat: "Camilan", emoji: "🥟", rate: 4.1 },
];

const CATS = ["Semua", "Makanan", "Minuman", "Camilan"];
const QUICK_BUDGET = [15000, 25000, 40000, 50000];
const STEPS = [
  { label: "Diterima", icon: Receipt },
  { label: "Diproses", icon: ChefHat },
  { label: "Siap diambil", icon: BellRing },
  { label: "Selesai", icon: PackageCheck },
];

const rp = (n) => "Rp" + n.toLocaleString("id-ID");
const hm = (d) => d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");

function makeSlots() {
  const base = new Date(Date.now() + 15 * 60000);
  base.setMinutes(Math.ceil(base.getMinutes() / 15) * 15, 0, 0);
  return Array.from({ length: 8 }, (_, i) => hm(new Date(base.getTime() + i * 15 * 60000)));
}

export default function CampusBite() {
  const [view, setView] = useState("menu");
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [kios, setKios] = useState("all");
  const [cat, setCat] = useState("Semua");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("populer");
  const [onlyBudget, setOnlyBudget] = useState(false);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [slots] = useState(makeSlots);
  const [pickup, setPickup] = useState(slots[0]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");

  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ ...MENU.find((m) => m.id === +id), qty })),
    [cart]
  );
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);
  const remaining = budget > 0 ? budget - total : Infinity;
  const over = budget > 0 && total > budget;

  const items = useMemo(() => {
    let list = MENU.filter(
      (m) =>
        (kios === "all" || m.k === kios) &&
        (cat === "Semua" || m.cat === cat) &&
        m.name.toLowerCase().includes(query.toLowerCase()) &&
        (!onlyBudget || budget === 0 || m.price <= Math.max(remaining, 0) || cart[m.id])
    );
    if (sort === "murah") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "mahal") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => b.rate - a.rate);
    return list;
  }, [kios, cat, query, sort, onlyBudget, budget, remaining, cart]);

  // Simulasi progres pesanan oleh kantin
  useEffect(() => {
    const t = setInterval(() => {
      setOrders((os) => os.map((o) => (o.status < 2 ? { ...o, status: o.status + 1 } : o)));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const saveBudget = (v) => {
    const n = Math.max(0, parseInt(v, 10) || 0);
    setBudget(n);
    setBudgetInput(n ? String(n) : "");
  };
  const add = (m) => {
    if (!KIOS.find((k) => k.id === m.k).open) return;
    if (budget > 0 && m.price > remaining) return setToast("Melebihi sisa budget");
    setCart((c) => ({ ...c, [m.id]: (c[m.id] || 0) + 1 }));
  };
  const dec = (id) =>
    setCart((c) => {
      const n = { ...c, [id]: c[id] - 1 };
      if (n[id] <= 0) delete n[id];
      return n;
    });
  const remove = (id) =>
    setCart((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });

  const checkout = () => {
    if (!count || !name.trim()) return;
    const code = "CB-" + Math.floor(100 + Math.random() * 900);
    setOrders((o) => [
      { code, name: name.trim(), note, pickup, items: cartItems, total, status: 0 },
      ...o,
    ]);
    setCart({});
    setNote("");
    setCartOpen(false);
    setView("pesanan");
    setToast("Pesanan " + code + " dikirim ke kantin");
  };

  const sisaPct = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;
  const activeCount = orders.filter((o) => o.status < 3).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <UtensilsCrossed size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">CampusBite</span>
          </div>
          <nav className="flex rounded-full bg-stone-100 p-1 text-sm font-medium">
            {[["menu", "Menu"], ["pesanan", "Pesanan"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`relative rounded-full px-4 py-1.5 transition ${
                  view === id ? "bg-white text-emerald-700 shadow-sm" : "text-stone-500"
                }`}
              >
                {label}
                {id === "pesanan" && activeCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
            aria-label="Buka keranjang"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-5">
        {view === "menu" ? (
          <>
            {/* Budget */}
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <Wallet size={16} /> Budget makan kamu
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center rounded-xl border border-emerald-200 bg-white px-3 focus-within:ring-2 focus-within:ring-emerald-400">
                  <span className="text-sm font-medium text-stone-400">Rp</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveBudget(budgetInput)}
                    placeholder="Contoh: 25000"
                    className="w-full bg-transparent px-2 py-2.5 outline-none"
                  />
                  <button
                    onClick={() => saveBudget(budgetInput)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Atur
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_BUDGET.map((b) => (
                    <button
                      key={b}
                      onClick={() => saveBudget(b)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        budget === b
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {rp(b)}
                    </button>
                  ))}
                </div>
              </div>
              {budget > 0 && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-stone-600">Terpakai {rp(total)}</span>
                    <span className={over ? "font-semibold text-red-600" : "font-semibold text-emerald-800"}>
                      Sisa {rp(Math.max(remaining, 0))}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full transition-all ${sisaPct > 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: sisaPct + "%" }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Kios */}
            <section className="mt-6">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-600">
                <Store size={16} /> Kantin & kios
              </h2>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
                <KiosCard active={kios === "all"} onClick={() => setKios("all")} emoji="🏫" title="Semua kios" sub={`${KIOS.length} kios`} open />
                {KIOS.map((k) => (
                  <KiosCard
                    key={k.id}
                    active={kios === k.id}
                    onClick={() => setKios(k.id)}
                    emoji={k.emoji}
                    title={k.name}
                    sub={k.open ? `${k.desc} • ±${k.eta} mnt` : "Sedang tutup"}
                    open={k.open}
                  />
                ))}
              </div>
            </section>

            {/* Filter */}
            <section className="mt-5 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 focus-within:ring-2 focus-within:ring-emerald-400">
                  <Search size={16} className="text-stone-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari menu…"
                    className="w-full bg-transparent py-2.5 outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} aria-label="Hapus pencarian">
                      <X size={16} className="text-stone-400" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3">
                  <SlidersHorizontal size={16} className="text-stone-400" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-transparent py-2.5 text-sm outline-none"
                  >
                    <option value="populer">Rating tertinggi</option>
                    <option value="murah">Harga termurah</option>
                    <option value="mahal">Harga termahal</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {CATS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-full px-4 py-1.5 text-sm transition ${
                      cat === c ? "bg-stone-800 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
                <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                  <input
                    type="checkbox"
                    checked={onlyBudget}
                    onChange={(e) => setOnlyBudget(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  Sesuai budget
                </label>
              </div>
              {onlyBudget && budget === 0 && (
                <p className="text-sm text-amber-700">Isi budget dulu supaya filter ini bisa dipakai.</p>
              )}
            </section>

            {/* Katalog */}
            <section className="mt-5">
              <p className="mb-3 text-sm text-stone-500">{items.length} menu ditemukan</p>
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-14 text-center">
                  <p className="text-3xl">🔍</p>
                  <p className="mt-2 font-medium">Tidak ada menu yang cocok</p>
                  <p className="text-sm text-stone-500">Coba naikkan budget atau ganti kategori.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((m) => {
                    const k = KIOS.find((x) => x.id === m.k);
                    const qty = cart[m.id] || 0;
                    const tooPricey = budget > 0 && m.price > remaining && !qty;
                    return (
                      <article
                        key={m.id}
                        className={`flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 ${!k.open ? "opacity-60" : ""}`}
                      >
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-4xl">
                          {m.emoji}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <h3 className="truncate font-semibold">{m.name}</h3>
                          <p className="truncate text-xs text-stone-500">{k.name}</p>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
                            <Star size={12} fill="currentColor" /> {m.rate}
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="font-bold text-emerald-700">{rp(m.price)}</span>
                            {!k.open ? (
                              <span className="text-xs text-stone-500">Tutup</span>
                            ) : qty > 0 ? (
                              <Stepper qty={qty} onMinus={() => dec(m.id)} onPlus={() => add(m)} />
                            ) : (
                              <button
                                onClick={() => add(m)}
                                disabled={tooPricey}
                                className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-500"
                              >
                                <Plus size={14} /> {tooPricey ? "Di luar budget" : "Tambah"}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          <OrdersView orders={orders} onDone={(code) => setOrders((os) => os.map((o) => (o.code === code ? { ...o, status: 3 } : o)))} goMenu={() => setView("menu")} />
        )}
      </main>

      {/* Bar keranjang mobile */}
      {view === "menu" && count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-md items-center justify-between rounded-2xl bg-emerald-600 px-5 py-3.5 text-white shadow-lg"
        >
          <span className="flex items-center gap-2 font-medium"><ShoppingBag size={18} /> {count} item</span>
          <span className="font-bold">{rp(total)}</span>
        </button>
      )}

      {/* Keranjang */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-stone-900/40" onClick={() => setCartOpen(false)}>
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-bold">Keranjang</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Tutup" className="rounded-full p-1.5 hover:bg-stone-100">
                <X size={20} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="text-4xl">🛒</p>
                <p className="mt-2 font-medium">Keranjang masih kosong</p>
                <p className="text-sm text-stone-500">Pilih menu dari kios favoritmu dulu.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                <ul className="space-y-3">
                  {cartItems.map((i) => (
                    <li key={i.id} className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-2xl">{i.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{i.name}</p>
                        <p className="text-xs text-stone-500">{KIOS.find((k) => k.id === i.k).name} • {rp(i.price)}</p>
                      </div>
                      <Stepper qty={i.qty} onMinus={() => dec(i.id)} onPlus={() => add(i)} />
                      <button onClick={() => remove(i.id)} aria-label={`Hapus ${i.name}`} className="p-1 text-stone-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-600">
                    <Clock size={16} /> Waktu pengambilan
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPickup(s)}
                        className={`rounded-lg border py-2 text-sm transition ${
                          pickup === s
                            ? "border-emerald-600 bg-emerald-50 font-semibold text-emerald-700"
                            : "border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama pengambil (wajib)"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Catatan (misal: tidak pedas)"
                    className="w-full resize-none rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="space-y-3 border-t border-stone-200 px-5 py-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{rp(total)}</span>
                </div>
                {budget > 0 && (
                  <p className={`text-sm ${over ? "text-red-600" : "text-emerald-700"}`}>
                    {over ? `Melebihi budget ${rp(total - budget)}` : `Masih sisa budget ${rp(remaining)}`}
                  </p>
                )}
                <button
                  onClick={checkout}
                  disabled={!name.trim() || over}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-500"
                >
                  {name.trim() ? `Pesan, ambil ${pickup}` : "Isi nama pengambil dulu"}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {toast && (
        <div className="fixed left-1/2 top-16 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-stone-800 px-4 py-2 text-sm text-white shadow-lg">
          <Check size={14} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}

function KiosCard({ active, onClick, emoji, title, sub, open }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-52 shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600" : "border-stone-200 bg-white hover:bg-stone-50"
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-2xl">{emoji}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className={`block truncate text-xs ${open ? "text-stone-500" : "text-red-500"}`}>{sub}</span>
      </span>
    </button>
  );
}

function Stepper({ qty, onMinus, onPlus }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-50 p-1">
      <button onClick={onMinus} aria-label="Kurangi" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
        <Minus size={14} />
      </button>
      <span className="w-4 text-center text-sm font-semibold">{qty}</span>
      <button onClick={onPlus} aria-label="Tambah" className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Plus size={14} />
      </button>
    </div>
  );
}

function OrdersView({ orders, onDone, goMenu }) {
  if (orders.length === 0)
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <p className="text-4xl">🧾</p>
        <p className="mt-2 font-medium">Belum ada pesanan</p>
        <p className="mb-4 text-sm text-stone-500">Pesan sekarang, ambil tanpa antre.</p>
        <button onClick={goMenu} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          Lihat menu
        </button>
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Status pesanan</h2>
      {orders.map((o) => (
        <article key={o.code} className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-emerald-700">{o.code}</p>
              <p className="text-sm text-stone-500">a.n. {o.name} • ambil pukul {o.pickup}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                o.status === 2 ? "bg-amber-100 text-amber-800" : o.status === 3 ? "bg-stone-100 text-stone-500" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {STEPS[o.status].label}
            </span>
          </div>

          <ol className="my-5 flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i <= o.status;
              return (
                <li key={s.label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-400"}`}>
                      {done && i < o.status ? <Check size={16} /> : <Icon size={16} />}
                    </span>
                    <span className={`text-center text-[11px] leading-tight ${done ? "font-medium text-stone-700" : "text-stone-400"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`mx-1 mb-5 h-0.5 flex-1 ${i < o.status ? "bg-emerald-600" : "bg-stone-200"}`} />}
                </li>
              );
            })}
          </ol>

          {o.status === 2 && (
            <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              Pesananmu sudah siap. Sebutkan kode {o.code} ke petugas kantin.
            </p>
          )}

          <ul className="space-y-1 border-t border-stone-100 pt-3 text-sm">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>{i.qty}× {i.name} <span className="text-stone-400">({KIOS.find((k) => k.id === i.k).name})</span></span>
                <span className="text-stone-600">{rp(i.price * i.qty)}</span>
              </li>
            ))}
            {o.note && <li className="text-stone-500">Catatan: {o.note}</li>}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
            <span className="font-bold">{rp(o.total)}</span>
            {o.status === 2 && (
              <button onClick={() => onDone(o.code)} className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                Sudah diambil
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
