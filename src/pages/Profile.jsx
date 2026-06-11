// ProfilePage.jsx — fully responsive (mobile drawer + fluid grids)

import { useState, useEffect } from "react";

// ─── Global styles injection ───────────────────────────────────────────────────
if (!document.getElementById("pp-styles")) {
  const el = document.createElement("style");
  el.id = "pp-styles";
  el.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    /* ── Sidebar drawer (mobile slide-in) ── */
    .pp-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(15,23,18,0.42);
      z-index: 998;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: ppFadeIn 0.2s ease;
    }
    .pp-overlay.active { display: block; }
    @keyframes ppFadeIn { from { opacity:0 } to { opacity:1 } }

    .pp-sidebar {
      width: 240px;
      flex-shrink: 0;
      background: #fff;
      border-right: 0.5px solid rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: sticky;
      top: 0;
      align-self: flex-start;
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
    }

    /* Mobile: sidebar becomes a fixed drawer */
    @media (max-width: 768px) {
      .pp-sidebar {
        position: fixed;
        top: 0; left: 0; bottom: 0;
        z-index: 999;
        min-height: 100dvh;
        overflow-y: auto;
        transform: translateX(-100%);
        box-shadow: 4px 0 32px -8px rgba(15,23,18,0.18);
      }
      .pp-sidebar.open { transform: translateX(0); }
      .pp-close-btn { display: flex !important; }
      .pp-hamburger { display: flex !important; }
    }

    /* ── Close + Hamburger buttons ── */
    .pp-close-btn {
      display: none;
      width: 34px; height: 34px;
      border-radius: 8px;
      border: 0.5px solid rgba(0,0,0,0.14);
      background: #fff;
      cursor: pointer;
      align-items: center; justify-content: center;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
    }
    .pp-close-btn:hover { background: #f5f3ef; }

    .pp-hamburger {
      display: none;
      width: 38px; height: 38px;
      border-radius: 9px;
      border: 0.5px solid rgba(0,0,0,0.14);
      background: #fff;
      cursor: pointer;
      align-items: center; justify-content: center;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.15s;
    }
    .pp-hamburger:hover { background: #e1f5ee; border-color: rgba(29,158,117,0.3); }

    /* ── Stats grid ── */
    .pp-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 2rem;
    }
    @media (max-width: 900px) {
      .pp-stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .pp-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 1.25rem; }
    }

    /* ── Two-col card rows ── */
    .pp-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    @media (max-width: 900px) {
      .pp-row-2 { grid-template-columns: 1fr; }
    }

    /* ── Personal info fields grid ── */
    .pp-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 480px) {
      .pp-fields-grid { grid-template-columns: 1fr; }
    }

    /* ── Address grid ── */
    .pp-address-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    @media (max-width: 900px) {
      .pp-address-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 500px) {
      .pp-address-grid { grid-template-columns: 1fr; }
    }

    /* ── Page heading row ── */
    .pp-page-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.75rem;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* ── Main padding ── */
    .pp-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      min-width: 0;
    }
    @media (max-width: 640px) {
      .pp-main { padding: 1.25rem 1rem; }
    }

    /* ── Topbar (mobile only) ── */
    .pp-topbar {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: #fff;
      border-bottom: 0.5px solid rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    @media (max-width: 768px) {
      .pp-topbar { display: flex; }
    }

    /* ── Nav hover ── */
    .pp-nav-btn { transition: all 0.15s; }
    .pp-nav-btn:hover { background: rgba(29,158,117,0.07) !important; color: #1D9E75 !important; }

    /* ── Card hover ── */
    .pp-card { transition: box-shadow 0.2s; }

    /* ── Danger zone btn ── */
    .pp-danger-btn { transition: background 0.15s; }
    .pp-danger-btn:hover { background: rgba(226,75,74,0.08) !important; }

    /* ── Edit profile btn ── */
    .pp-edit-btn { transition: background 0.15s; }
    .pp-edit-btn:hover { background: rgba(29,158,117,0.07) !important; }

    /* ── Wishlist scroll ── */
    .pp-wishlist-scroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .pp-wishlist-scroll::-webkit-scrollbar { display: none; }

    /* ── Sign out btn ── */
    .pp-signout-btn { transition: background 0.15s; }
    .pp-signout-btn:hover { background: rgba(163,45,45,0.06) !important; }
  `;
  document.head.appendChild(el);
}

// ─── Design tokens ────────────────────────────────────────────────────
const T = {
  teal:      "#1D9E75",
  tealDark:  "#0F6E56",
  tealLight: "#E1F5EE",
  pageBg:    "#F5F3EF",
  surface:   "#FFFFFF",
  border:    "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.14)",
  muted:     "#888780",
  text:      "#1A1A18",
  textSub:   "#5F5E5A",
};

// ─── Helpers ──────────────────────────────────────────────────────────

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((p) => !p)}
      style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: on ? T.teal : "#C8C4BC",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s",
        minWidth: 36,
      }}
    >
      <span style={{
        position: "absolute", width: 14, height: 14, borderRadius: "50%",
        background: "#fff", top: 3, left: on ? 19 : 3,
        transition: "left 0.2s", display: "block",
      }} />
    </button>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.border}`,
      borderRadius: 12, padding: "0.9rem 1.1rem",
    }}>
      <div style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 500, color: T.teal, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}

function Field({ label, value, fullWidth }) {
  return (
    <div style={{ gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: 13, color: T.text, background: T.pageBg,
        border: `0.5px solid ${T.border}`, borderRadius: 8,
        padding: "8px 12px", lineHeight: 1.3, wordBreak: "break-all",
      }}>
        {value || "—"}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div className="pp-card" style={{
      background: T.surface, border: `0.5px solid ${T.border}`,
      borderRadius: 12, padding: "1.25rem 1.5rem", ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ icon, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 14, fontWeight: 500, color: T.text, marginBottom: "1.25rem",
    }}>
      <span style={{ color: T.teal, display: "flex" }}>{icon}</span>
      {children}
    </div>
  );
}

function LinkBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 4,
      fontSize: 12, color: T.teal, background: "none",
      border: "none", cursor: "pointer", fontFamily: "inherit",
      flexShrink: 0,
      padding: "4px 0",
      minHeight: 32,
    }}>
      {children}
    </button>
  );
}

function StatusChip({ status }) {
  const map = {
    Delivered:  { bg: T.tealLight, color: T.tealDark },
    Shipped:    { bg: "#E6F1FB",   color: "#185FA5"  },
    Processing: { bg: "#FAEEDA",   color: "#854F0B"  },
  };
  const s = map[status] || { bg: "#eee", color: "#333" };
  return (
    <span style={{
      fontSize: 10, padding: "2px 8px", borderRadius: 100,
      background: s.bg, color: s.color, display: "inline-block", marginTop: 3,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

// ─── NAV items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "profile",       label: "Profile"       },
  { key: "orders",        label: "Orders"        },
  { key: "wishlist",      label: "Wishlist"      },
  { key: "addresses",     label: "Addresses"     },
  { key: "notifications", label: "Notifications" },
  { key: "security",      label: "Security"      },
];

// ─── Sidebar inner content (shared between desktop + drawer) ──────────
function SidebarContent({ user, activeNav, onNav, onSignOut, onClose }) {
  const { firstName = "—", lastName = "—", email = "—", memberTier } = user;
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      {/* Avatar zone */}
      <div style={{
        padding: "1.75rem 1.5rem 1.5rem",
        borderBottom: `0.5px solid ${T.border}`,
        textAlign: "center",
        position: "relative",
      }}>
        {/* Close X — only visible on mobile via CSS */}
        <button
          className="pp-close-btn"
          onClick={onClose}
          aria-label="Close menu"
          style={{ position: "absolute", top: 14, right: 14 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#888780" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: T.teal, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 500, letterSpacing: 1,
          }}>
            {initials}
          </div>
          <button aria-label="Change photo" style={{
            position: "absolute", bottom: 0, right: 0,
            width: 22, height: 22, borderRadius: "50%",
            background: T.surface, border: `0.5px solid ${T.borderMid}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 11,
          }}>
            📷
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>
          {firstName} {lastName}
        </div>
        <div style={{
          fontSize: 12, color: T.muted, marginTop: 3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: "100%",
        }}>
          {email}
        </div>
        {memberTier && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            marginTop: 10, padding: "3px 10px",
            background: T.tealLight, color: T.tealDark,
            borderRadius: 100, fontSize: 11, fontWeight: 500,
          }}>
            ★ {memberTier}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.key;
          return (
            <button
              key={item.key}
              className="pp-nav-btn"
              onClick={() => { onNav?.(item.key); onClose?.(); }}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                padding: "10px 1.5rem", fontSize: 13,
                background: active ? `${T.tealLight}44` : "transparent",
                borderLeft: `2px solid ${active ? T.teal : "transparent"}`,
                borderTop: "none", borderRight: "none", borderBottom: "none",
                color: active ? T.teal : T.textSub,
                fontWeight: active ? 500 : 400,
                cursor: "pointer", fontFamily: "inherit",
                textAlign: "left", minHeight: 42,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem 1.5rem", borderTop: `0.5px solid ${T.border}` }}>
        <button
          className="pp-signout-btn"
          onClick={onSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "10px 12px", borderRadius: 8,
            border: `0.5px solid rgba(163,45,45,0.4)`,
            background: "transparent", color: "#A32D2D",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            minHeight: 40,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          ← Sign out
        </button>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────
export default function ProfilePage({
  user = {},
  stats = {},
  addresses = [],
  recentOrders = [],
  wishlist = [],
  onEditProfile,
  onChangePassword,
  onDeactivate,
  onDeleteAccount,
  onAddAddress,
  onViewOrders,
  onViewWishlist,
  onSignOut,
}) {
  const [activeNav, setActiveNav] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const {
    firstName = "—", lastName = "—",
    email = "—", phone = "—",
    gender = "—", dob = "—",
    joinedDate = "—", memberTier,
  } = user;

  const {
    totalOrders = 0,
    totalSpent = "—",
    wishlisted = 0,
    reviews = 0,
  } = stats;

  const PREFS = [
    { label: "Email notifications", desc: "Orders, offers & newsletters",  on: true  },
    { label: "SMS alerts",          desc: "Delivery & shipping updates",    on: false },
    { label: "Two-factor auth",     desc: "Extra security on login",        on: false },
    { label: "Promotional emails",  desc: "Sales and new arrivals",         on: true  },
  ];

  return (
    <div style={{
      background: T.pageBg, minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* ── Mobile topbar ── */}
      <div className="pp-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="pp-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#5F5E5A" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>My Profile</span>
        </div>
        <button
          className="pp-edit-btn"
          onClick={onEditProfile}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 13px", borderRadius: 8,
            border: `0.5px solid ${T.teal}`, background: "transparent",
            color: T.teal, fontSize: 12, cursor: "pointer",
            fontFamily: "inherit", minHeight: 36,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          ✎ Edit
        </button>
      </div>

      {/* ── Drawer overlay ── */}
      <div
        className={`pp-overlay${drawerOpen ? " active" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Layout shell ── */}
      <div style={{ display: "flex" }}>

        {/* ── Sidebar ── */}
        <aside className={`pp-sidebar${drawerOpen ? " open" : ""}`}
          style={{ display: "flex", flexDirection: "column" }}>
          <SidebarContent
            user={{ firstName, lastName, email, memberTier }}
            activeNav={activeNav}
            onNav={setActiveNav}
            onSignOut={onSignOut}
            onClose={() => setDrawerOpen(false)}
          />
        </aside>

        {/* ── Main content ── */}
        <main className="pp-main">

          {/* Page heading — desktop only (mobile has topbar) */}
          <div className="pp-page-heading" style={{ display: undefined }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: T.text }}>My Profile</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>Member since {joinedDate}</div>
            </div>
            <button
              className="pp-edit-btn"
              onClick={onEditProfile}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8,
                border: `0.5px solid ${T.teal}`, background: "transparent",
                color: T.teal, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit", flexShrink: 0, minHeight: 38,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ✎ Edit profile
            </button>
          </div>

          {/* Stats row */}
          <div className="pp-stats-grid">
            <StatCard value={totalOrders} label="Orders placed" />
            <StatCard value={totalSpent}  label="Total spent"   />
            <StatCard value={wishlisted}  label="Wishlisted"    />
            <StatCard value={reviews}     label="Reviews given" />
          </div>

          {/* Row 1 — Personal info + Preferences */}
          <div className="pp-row-2">

            {/* Personal info */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: 8 }}>
                <CardTitle icon="👤" >Personal info</CardTitle>
                <LinkBtn onClick={onEditProfile}>✎ Edit</LinkBtn>
              </div>
              <div className="pp-fields-grid">
                <Field label="First name"    value={firstName} />
                <Field label="Last name"     value={lastName}  />
                <Field label="Email"         value={email}     fullWidth />
                <Field label="Phone"         value={phone}     />
                <Field label="Gender"        value={gender}    />
                <Field label="Date of birth" value={dob}       fullWidth />
              </div>
            </Card>

            {/* Preferences */}
            <Card>
              <CardTitle icon="⚙">Preferences</CardTitle>
              {PREFS.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 0",
                  borderBottom: i < PREFS.length - 1 ? `0.5px solid ${T.border}` : "none",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{p.desc}</div>
                  </div>
                  <Toggle defaultOn={p.on} />
                </div>
              ))}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                paddingTop: 12, borderTop: `0.5px solid ${T.border}`, marginTop: 4,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Change password</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Last updated 3 months ago</div>
                </div>
                <button onClick={onChangePassword} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 18, color: T.muted, padding: "4px 8px", minHeight: 36,
                }}>›</button>
              </div>
            </Card>
          </div>

          {/* Row 2 — Orders + Wishlist */}
          <div className="pp-row-2">

            {/* Recent orders */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: 8 }}>
                <CardTitle icon="🛍">Recent orders</CardTitle>
                <LinkBtn onClick={onViewOrders}>View all ›</LinkBtn>
              </div>
              {recentOrders.slice(0, 3).map((o, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < 2 ? `0.5px solid ${T.border}` : "none",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: T.pageBg, border: `0.5px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 18,
                  }}>
                    📦
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500, color: T.text,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {o.id}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                      {o.itemCount} item{o.itemCount !== 1 ? "s" : ""} · {o.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>₹{o.amount}</div>
                    <StatusChip status={o.status} />
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: T.muted }}>
                  No orders yet
                </div>
              )}
            </Card>

            {/* Wishlist */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: 8 }}>
                <CardTitle icon="♡">Wishlist</CardTitle>
                <LinkBtn onClick={onViewWishlist}>View all ›</LinkBtn>
              </div>
              <div className="pp-wishlist-scroll">
                {wishlist.slice(0, 6).map((item, i) => (
                  <div key={i} style={{ flexShrink: 0, width: 76, textAlign: "center" }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: 8,
                      background: T.pageBg, border: `0.5px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 6, overflow: "hidden",
                    }}>
                      {item.thumbnail
                        ? <img src={item.thumbnail} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 24 }}>🛍</span>
                      }
                    </div>
                    <div style={{ fontSize: 11, color: T.textSub, lineHeight: 1.3,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: 76,
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: T.teal, marginTop: 2 }}>₹{item.price}</div>
                  </div>
                ))}
                {wishlist.length === 0 && (
                  <div style={{ fontSize: 13, color: T.muted, padding: "24px 0" }}>Nothing wishlisted yet</div>
                )}
              </div>
            </Card>
          </div>

          {/* Address book */}
          <Card style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: 8 }}>
              <CardTitle icon="📍">Address book</CardTitle>
              <LinkBtn onClick={onAddAddress}>+ Add new</LinkBtn>
            </div>
            <div className="pp-address-grid">
              {addresses.map((addr, i) => (
                <div key={i} style={{
                  border: `0.5px solid ${addr.isDefault ? T.teal : T.border}`,
                  borderRadius: 8, padding: "12px 14px",
                  background: addr.isDefault ? `${T.tealLight}33` : T.pageBg,
                }}>
                  {addr.isDefault && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      fontSize: 10, fontWeight: 500, padding: "2px 8px",
                      background: T.tealLight, color: T.tealDark,
                      borderRadius: 100, marginBottom: 6,
                    }}>
                      ✓ Default
                    </span>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{addr.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
                    {addr.line1}<br />
                    {addr.city}, {addr.state} — {addr.pin}<br />
                    {addr.phone}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {["Edit", !addr.isDefault && "Set default", "Remove"].filter(Boolean).map((a) => (
                      <button key={a} style={{
                        fontSize: 11, padding: "4px 9px", borderRadius: 4,
                        border: `0.5px solid ${T.borderMid}`,
                        background: "transparent", color: T.textSub,
                        cursor: "pointer", fontFamily: "inherit",
                        minHeight: 28,
                      }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add address tile */}
              <button onClick={onAddAddress} style={{
                border: `1px dashed ${T.borderMid}`, borderRadius: 8,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 6, minHeight: 110, color: T.muted,
                fontSize: 12, cursor: "pointer", background: "transparent",
                fontFamily: "inherit",
                WebkitTapHighlightColor: "transparent",
              }}>
                <span style={{ fontSize: 22 }}>+</span> Add address
              </button>
            </div>
          </Card>

          {/* Danger zone */}
          <div style={{
            background: "rgba(252,235,235,0.6)", border: "0.5px solid #F7C1C1",
            borderRadius: 12, padding: "1.25rem 1.5rem",
          }}>
            <div style={{
              fontSize: 14, fontWeight: 500, color: "#A32D2D",
              display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem",
            }}>
              ⚠ Danger zone
            </div>
            {[
              { label: "Deactivate account", desc: "Temporarily disable your account. You can reactivate anytime.", action: "Deactivate",    fn: onDeactivate   },
              { label: "Delete account",     desc: "Permanently remove your account and all data. Cannot be undone.", action: "Delete account", fn: onDeleteAccount },
            ].map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, padding: "12px 0",
                borderBottom: i === 0 ? "0.5px solid #F7C1C1" : "none",
                flexWrap: "wrap",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{d.desc}</div>
                </div>
                <button
                  className="pp-danger-btn"
                  onClick={d.fn}
                  style={{
                    fontSize: 12, padding: "7px 14px", borderRadius: 6,
                    border: "0.5px solid #E24B4A", background: "transparent",
                    color: "#A32D2D", cursor: "pointer", fontFamily: "inherit",
                    flexShrink: 0, minHeight: 36,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {d.action}
                </button>
              </div>
            ))}
          </div>

          {/* Bottom breathing room on mobile */}
          <div style={{ height: 32 }} />
        </main>
      </div>
    </div>
  );
}

// ─── Usage example ────────────────────────────────────────────────────
//
// <ProfilePage
//   user={{
//     firstName: "Arjun", lastName: "Mehta",
//     email: "arjun@email.com", phone: "+91 98765 43210",
//     gender: "Male", dob: "14 August 1995",
//     joinedDate: "March 2022", memberTier: "Gold Member",
//   }}
//   stats={{ totalOrders: 24, totalSpent: "₹38,450", wishlisted: 12, reviews: 7 }}
//   addresses={[
//     { name: "Home",   line1: "14, Shivaji Nagar", city: "Bareilly", state: "UP", pin: "243001", phone: "+91 98765 43210", isDefault: true  },
//     { name: "Office", line1: "Plot 7, Civil Lines", city: "Bareilly", state: "UP", pin: "243006", phone: "+91 98765 43210", isDefault: false },
//   ]}
//   recentOrders={[
//     { id: "#ORD-2024-0091", itemCount: 3, date: "28 May 2024", amount: "4,200", status: "Delivered"  },
//     { id: "#ORD-2024-0076", itemCount: 1, date: "14 May 2024", amount: "1,850", status: "Shipped"    },
//     { id: "#ORD-2024-0058", itemCount: 2, date: "2 May 2024",  amount: "3,100", status: "Processing" },
//   ]}
//   wishlist={[
//     { name: "Linen Kurta",       price: "1,299" },
//     { name: "Kolhapuri Sandals", price: "899"   },
//     { name: "Titan Watch",       price: "3,499" },
//   ]}
//   onEditProfile={() => {}}
//   onChangePassword={() => {}}
//   onDeactivate={() => {}}
//   onDeleteAccount={() => {}}
//   onAddAddress={() => {}}
//   onViewOrders={() => {}}
//   onViewWishlist={() => {}}
//   onSignOut={() => {}}
// />