"use client";

import { useState } from "react";
import Image from "next/image";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import EmptyState from "@/components/ui/EmptyState";
import { mockProfile, mockReservations } from "@/lib/data/cars";
import { formatDate, formatPrice } from "@/lib/utils/format";
import styles from "./page.module.css";

type Tab = "reservations" | "profile";

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("reservations");
  const [profile, setProfile] = useState(mockProfile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.statusConfirmed;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Təsdiqlənib";
      case "completed":
        return "Tamamlanıb";
      case "cancelled":
        return "Ləğv edilib";
      default:
        return status;
    }
  };

  return (
    <FleetBookingShell showJourney={false}>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Hesabım</h1>
          <p className={styles.subtitle}>Rezervasiyalarınızı idarə edin və profil məlumatlarını yeniləyin</p>
        </header>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "reservations"}
            className={`${styles.tab} ${tab === "reservations" ? styles.tabActive : ""}`}
            onClick={() => setTab("reservations")}
          >
            Rezervasiyalar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "profile"}
            className={`${styles.tab} ${tab === "profile" ? styles.tabActive : ""}`}
            onClick={() => setTab("profile")}
          >
            Profil
          </button>
        </div>

        {tab === "reservations" && (
          <section className={styles.section} role="tabpanel">
            {mockReservations.length === 0 ? (
              <EmptyState
                title="Rezervasiya yoxdur"
                message="Hələ heç bir rezervasiya etməmisiniz."
                actionLabel="Avtomobil seç"
                actionHref="/fleet"
              />
            ) : (
              <div className={styles.reservationList}>
                {mockReservations.map((res) => (
                  <article key={res.id} className={styles.reservation}>
                    <div className={styles.resImage}>
                      <Image
                        src={res.carImage}
                        alt={res.carName}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="140px"
                      />
                    </div>
                    <div className={styles.resInfo}>
                      <h3>{res.carName}</h3>
                      <div className={styles.resMeta}>
                        <span>{res.location}</span>
                        <span>
                          {formatDate(res.pickupDate)} — {formatDate(res.returnDate)}
                        </span>
                      </div>
                      <span className={`${styles.resStatus} ${statusClass(res.status)}`}>
                        {statusLabel(res.status)}
                      </span>
                    </div>
                    <div className={styles.resPrice}>
                      <div className={styles.resPriceAmount}>{formatPrice(res.totalPrice)}</div>
                      <div className={styles.resPriceLabel}>cəmi</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "profile" && (
          <section className={styles.section} role="tabpanel">
            <form
              className={styles.profileForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className={styles.field}>
                <label className={styles.label} htmlFor="profile-name">Ad Soyad</label>
                <input
                  id="profile-name"
                  type="text"
                  className={styles.input}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="profile-email">E-poçt</label>
                <input
                  id="profile-email"
                  type="email"
                  className={styles.input}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="profile-phone">Telefon</label>
                <input
                  id="profile-phone"
                  type="tel"
                  className={styles.input}
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="profile-license">Sürücülük vəsiqəsi</label>
                <input
                  id="profile-license"
                  type="text"
                  className={styles.input}
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? "Saxlanılır..." : "Yadda saxla"}
              </button>
              {saved && <p className={styles.savedMsg}>Profil uğurla yeniləndi</p>}
            </form>
          </section>
        )}
      </div>
    </FleetBookingShell>
  );
}
