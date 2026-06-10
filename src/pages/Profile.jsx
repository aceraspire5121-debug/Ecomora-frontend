// ProfilePage.jsx
// Drop-in replacement — wire your real data via props, rest is plug-and-play.

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────
const T = {
  teal:       "#1D9E75",
  tealDark:   "#0F6E56",
  tealLight:  "#E1F5EE",
  amber:      "#FAC775",
  amberDark:  "#633806",
  pageBg:     "#F5F3EF",
  surface:    "#FFFFFF",
  border:     "rgba(0,0,0,0.08)",
  borderMid:  "rgba(0,0,0,0.14)",
  muted:      "#888780",
  text:       "#1A1A18",
  textSub:    "#5F5E5A",
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
      borderRadius: 12, padding: "1rem 1.25rem",
    }}>
      <div style={{ fontSize: 24, fontWeight: 500, color: T.teal, lineHeight: 1, marginBottom: 4 }}>
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
        fontSize: 13, color: T.text, background: "#F5F3EF",
        border: `0.5px solid ${T.border}`, borderRadius: 8,
        padding: "8px 12px", lineHeight: 1,
      }}>
        {value || "—"}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
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
    }}>
      {children}
    </button>
  );
}

function StatusChip({ status }) {
  const map = {
    Delivered:  { bg: T.tealLight,  color: T.tealDark  },
    Shipped:    { bg: "#E6F1FB",    color: "#185FA5"   },
    Processing: { bg: "#FAEEDA",    color: "#854F0B"   },
  };
  const s = map[status] || { bg: "#eee", color: "#333" };
  return (
    <span style={{
      fontSize: 10, padding: "2px 8px", borderRadius: 100,
      background: s.bg, color: s.color, display: "inline-block", marginTop: 3,
    }}>
      {status}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "profile",       label: "Profile"        },
  { key: "orders",        label: "Orders"         },
  { key: "wishlist",      label: "Wishlist"       },
  { key: "addresses",     label: "Addresses"      },
  { key: "notifications", label: "Notifications"  },
  { key: "security",      label: "Security"       },
];

function Sidebar({ user, activeNav, onNav, onSignOut }) {
  const { firstName = "—", lastName = "—", email = "—", memberTier } = user;
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <aside style={{
      width: 240, flexShrink: 0, background: T.surface,
      borderRight: `0.5px solid ${T.border}`,
      display: "flex", flexDirection: "column", minHeight: "100vh",
      position: "sticky", top: 0, alignSelf: "flex-start",
    }}>
      {/* Avatar zone */}
      <div style={{
        padding: "2rem 1.5rem 1.5rem", borderBottom: `0.5px solid ${T.border}`, textAlign: "center",
      }}>
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
        <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{email}</div>
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
              onClick={() => onNav?.(item.key)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                padding: "10px 1.5rem", fontSize: 13,
                background: active ? `${T.tealLight}44` : "transparent",
                borderLeft: `2px solid ${active ? T.teal : "transparent"}`,
                borderTop: "none", borderRight: "none", borderBottom: "none",
                color: active ? T.teal : T.textSub,
                fontWeight: active ? 500 : 400,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.15s", textAlign: "left",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem 1.5rem", borderTop: `0.5px solid ${T.border}` }}>
        <button onClick={onSignOut} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8,
          border: `0.5px solid rgba(163,45,45,0.4)`,
          background: "transparent", color: "#A32D2D",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          transition: "background 0.15s",
        }}>
          ← Sign out
        </button>
      </div>
    </aside>
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
      display: "flex", fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <Sidebar
        user={{ firstName, lastName, email, memberTier }}
        activeNav={activeNav}
        onNav={setActiveNav}
        onSignOut={onSignOut}
      />

      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>

        {/* Page heading */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: T.text }}>My Profile</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>Member since {joinedDate}</div>
          </div>
          <button onClick={onEditProfile} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8,
            border: `0.5px solid ${T.teal}`, background: "transparent",
            color: T.teal, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", transition: "background 0.15s",
          }}>
            ✎ Edit profile
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "2rem" }}>
          <StatCard value={totalOrders} label="Orders placed"  />
          <StatCard value={totalSpent}  label="Total spent"    />
          <StatCard value={wishlisted}  label="Wishlisted"     />
          <StatCard value={reviews}     label="Reviews given"  />
        </div>

        {/* Row 1 — Personal info + Preferences */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

          {/* Personal info */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <CardTitle icon="👤">Personal info</CardTitle>
              <LinkBtn onClick={onEditProfile}>✎ Edit</LinkBtn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                display: "flex", alignItems: "center",
                padding: "11px 0",
                borderBottom: i < PREFS.length - 1 ? `0.5px solid ${T.border}` : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{p.desc}</div>
                </div>
                <Toggle defaultOn={p.on} />
              </div>
            ))}
            <div style={{
              display: "flex", alignItems: "center",
              paddingTop: 12, borderTop: `0.5px solid ${T.border}`, marginTop: 4,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Change password</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Last updated 3 months ago</div>
              </div>
              <button onClick={onChangePassword} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: T.muted,
              }}>›</button>
            </div>
          </Card>
        </div>

        {/* Row 2 — Orders + Wishlist */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

          {/* Recent orders */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{o.id}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                    {o.itemCount} item{o.itemCount !== 1 ? "s" : ""} · {o.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>₹{o.amount}</div>
                  <StatusChip status={o.status} />
                </div>
              </div>
            ))}
          </Card>

          {/* Wishlist */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <CardTitle icon="♡">Wishlist</CardTitle>
              <LinkBtn onClick={onViewWishlist}>View all ›</LinkBtn>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
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
                  <div style={{ fontSize: 11, color: T.textSub, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.teal, marginTop: 2 }}>₹{item.price}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Address book */}
        <Card style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <CardTitle icon="📍">Address book</CardTitle>
            <LinkBtn onClick={onAddAddress}>+ Add new</LinkBtn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
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
                      fontSize: 11, padding: "3px 8px", borderRadius: 4,
                      border: `0.5px solid ${T.borderMid}`,
                      background: "transparent", color: T.textSub,
                      cursor: "pointer", fontFamily: "inherit",
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
              fontFamily: "inherit", transition: "border-color 0.15s, color 0.15s",
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
            { label: "Deactivate account", desc: "Temporarily disable your account. You can reactivate anytime.", action: "Deactivate", fn: onDeactivate },
            { label: "Delete account",     desc: "Permanently remove your account and all data. Cannot be undone.", action: "Delete account", fn: onDeleteAccount },
          ].map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i === 0 ? "0.5px solid #F7C1C1" : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{d.label}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{d.desc}</div>
              </div>
              <button onClick={d.fn} style={{
                fontSize: 12, padding: "6px 14px", borderRadius: 6,
                border: "0.5px solid #E24B4A", background: "transparent",
                color: "#A32D2D", cursor: "pointer", fontFamily: "inherit",
                flexShrink: 0, transition: "background 0.15s",
              }}>
                {d.action}
              </button>
            </div>
          ))}
        </div>

      </main>
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
//     { name: "Home", line1: "14, Shivaji Nagar", city: "Bareilly", state: "UP", pin: "243001", phone: "+91 98765 43210", isDefault: true },
//     { name: "Office", line1: "Plot 7, Civil Lines", city: "Bareilly", state: "UP", pin: "243006", phone: "+91 98765 43210", isDefault: false },
//   ]}
//   recentOrders={[
//     { id: "#ORD-2024-0091", itemCount: 3, date: "28 May 2024", amount: "4,200", status: "Delivered" },
//     { id: "#ORD-2024-0076", itemCount: 1, date: "14 May 2024", amount: "1,850", status: "Shipped"   },
//     { id: "#ORD-2024-0058", itemCount: 2, date: "2 May 2024",  amount: "3,100", status: "Processing"},
//   ]}
//   wishlist={[
//     { name: "Linen Kurta",      price: "1,299" },
//     { name: "Kolhapuri Sandals",price: "899"   },
//     { name: "Titan Watch",      price: "3,499" },
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