"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { bookingAddons, cars, getCarById, LOCATIONS } from "@/lib/data/cars";
import { calculateDays, formatPrice } from "@/lib/utils/format";
import styles from "./BookingWizard.module.css";

const STEPS = [
  { id: 1, label: "Tarix & yer" },
  { id: 2, label: "Əlavələr" },
  { id: 3, label: "Ödəniş" },
];

export default function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCarId = searchParams.get("car") ?? cars[0]?.id ?? "";
  const initialPickup = searchParams.get("pickup") ?? "";
  const initialReturn = searchParams.get("return") ?? "";
  const initialAddons = searchParams.get("addons")?.split(",").filter(Boolean) ?? [];

  const [step, setStep] = useState(1);
  const [carId, setCarId] = useState(initialCarId);
  const [location, setLocation] = useState(searchParams.get("location") ?? LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialAddons);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "transfer">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const car = getCarById(carId);
  const days = useMemo(
    () => (pickupDate && returnDate ? calculateDays(pickupDate, returnDate) : 0),
    [pickupDate, returnDate]
  );

  const baseTotal = car ? car.pricePerDay * days : 0;
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = bookingAddons.find((a) => a.id === id);
    return sum + (addon ? addon.pricePerDay * days : 0);
  }, 0);
  const grandTotal = baseTotal + addonTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validateStep = (): boolean => {
    setError("");
    if (step === 1) {
      if (!carId || !pickupDate || !returnDate) {
        setError("Avtomobil və tarixləri seçin.");
        return false;
      }
      if (new Date(returnDate) <= new Date(pickupDate)) {
        setError("Qaytarma tarixi götürmə tarixindən sonra olmalıdır.");
        return false;
      }
    }
    if (step === 3 && paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setError("Kart məlumatlarını doldurun.");
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setCompleted(true);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.push("/fleet");
  };

  if (completed) {
    return (
      <div className={styles.wizard}>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Rezervasiya təsdiqləndi!</h2>
          <p className={styles.successDesc}>
            {car?.name} — {formatPrice(grandTotal)} · {days} gün
          </p>
          <Link href="/account" className={styles.successLink}>
            Rezervasiyalarıma bax
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      <div className={styles.steps} role="tablist" aria-label="Rezervasiya addımları">
        {STEPS.map((s, i) => (
          <div key={s.id} className={styles.stepItem}>
            {i > 0 && (
              <div className={`${styles.stepConnector} ${step > s.id ? styles.stepConnectorDone : ""}`} />
            )}
            <div
              className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ""} ${step > s.id ? styles.stepDone : ""}`}
              role="tab"
              aria-selected={step === s.id}
            >
              <div className={styles.stepCircle}>{step > s.id ? "✓" : s.id}</div>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        {car && (
          <div className={styles.carPreview}>
            <div className={styles.carPreviewImage}>
              <Image src={car.image} alt={car.name} fill style={{ objectFit: "cover" }} sizes="120px" />
            </div>
            <div className={styles.carPreviewInfo}>
              <h4>{car.name}</h4>
              <p>{formatPrice(car.pricePerDay)}/gün · {car.location}</p>
            </div>
          </div>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}

        {step === 1 && (
          <>
            <h2 className={styles.panelTitle}>Tarix və yer seçimi</h2>
            <p className={styles.panelDesc}>Avtomobili harada və nə vaxt götürmək istəyirsiniz?</p>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="wiz-car">Avtomobil</label>
                <select
                  id="wiz-car"
                  className={styles.select}
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                >
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {formatPrice(c.pricePerDay)}/gün</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="wiz-location">Götürmə yeri</label>
                <select
                  id="wiz-location"
                  className={styles.select}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="wiz-pickup">Götürmə tarixi</label>
                <input
                  id="wiz-pickup"
                  type="date"
                  className={styles.input}
                  value={pickupDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="wiz-return">Qaytarma tarixi</label>
                <input
                  id="wiz-return"
                  type="date"
                  className={styles.input}
                  value={returnDate}
                  min={pickupDate || undefined}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.panelTitle}>Əlavə xidmətlər</h2>
            <p className={styles.panelDesc}>Səfərinizi daha rahat etmək üçün əlavələr seçin.</p>
            <div className={styles.addonList}>
              {bookingAddons.map((addon) => (
                <label
                  key={addon.id}
                  className={`${styles.addon} ${selectedAddons.includes(addon.id) ? styles.addonSelected : ""}`}
                >
                  <input
                    type="checkbox"
                    className={styles.addonCheck}
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                  />
                  <div className={styles.addonInfo}>
                    <div className={styles.addonName}>{addon.name}</div>
                    <div className={styles.addonDesc}>{addon.description}</div>
                  </div>
                  <span className={styles.addonPrice}>+{formatPrice(addon.pricePerDay)}/gün</span>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className={styles.panelTitle}>Ödəniş</h2>
            <p className={styles.panelDesc}>Ödəniş üsulunu seçin və rezervasiyanı tamamlayın.</p>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Avtomobil ({days} gün)</span>
                <span>{formatPrice(baseTotal)}</span>
              </div>
              {selectedAddons.map((id) => {
                const addon = bookingAddons.find((a) => a.id === id);
                if (!addon) return null;
                return (
                  <div key={id} className={styles.summaryRow}>
                    <span>{addon.name}</span>
                    <span>{formatPrice(addon.pricePerDay * days)}</span>
                  </div>
                );
              })}
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Cəmi</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className={styles.paymentMethods}>
              {([
                { id: "card" as const, label: "Bank kartı", icon: "card" },
                { id: "cash" as const, label: "Nağd", icon: "cash" },
                { id: "transfer" as const, label: "Köçürmə", icon: "transfer" },
              ]).map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`${styles.paymentMethod} ${paymentMethod === method.id ? styles.paymentSelected : ""}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <svg className={styles.paymentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {method.icon === "card" && (
                      <>
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M2 10h20" />
                      </>
                    )}
                    {method.icon === "cash" && (
                      <>
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                    {method.icon === "transfer" && (
                      <>
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </>
                    )}
                  </svg>
                  {method.label}
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className={styles.cardForm}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="card-number">Kart nömrəsi</label>
                  <input
                    id="card-number"
                    type="text"
                    className={styles.input}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="card-expiry">Bitmə tarixi</label>
                    <input
                      id="card-expiry"
                      type="text"
                      className={styles.input}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="card-cvc">CVC</label>
                    <input
                      id="card-cvc"
                      type="text"
                      className={styles.input}
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.backBtn} onClick={handleBack}>
            {step === 1 ? "Ləğv et" : "Geri"}
          </button>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? "Emal edilir..." : step === 3 ? "Rezervasiya et" : "Davam et"}
          </button>
        </div>
      </div>
    </div>
  );
}
