"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import styles from "./FleetBookingShell.module.css";

const JOURNEY_STEPS = [
  { href: "/fleet", label: "Park seç", step: 1 },
  { href: "/cars", label: "Avtomobil", step: 2, matchPrefix: "/cars" },
  { href: "/booking", label: "Rezervasiya", step: 3 },
  { href: "/account", label: "Təsdiq", step: 4 },
];

interface FleetBookingShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showJourney?: boolean;
}

export default function FleetBookingShell({
  children,
  sidebar,
  showJourney = true,
}: FleetBookingShellProps) {
  const pathname = usePathname();

  const getStepStatus = (step: typeof JOURNEY_STEPS[number]) => {
    if (step.matchPrefix && pathname.startsWith(step.matchPrefix)) return "active";
    if (step.href === "/fleet" && pathname === "/fleet") return "active";
    if (step.href === "/booking" && pathname.startsWith("/booking")) return "active";
    if (step.href === "/account" && pathname.startsWith("/account")) return "active";
    if (pathname === "/" && step.step === 1) return "active";

    const currentIdx = JOURNEY_STEPS.findIndex((s) => {
      if (s.matchPrefix && pathname.startsWith(s.matchPrefix)) return true;
      if (s.href === pathname) return true;
      if (s.href === "/fleet" && pathname === "/fleet") return true;
      if (s.href === "/booking" && pathname.startsWith("/booking")) return true;
      if (s.href === "/account" && pathname.startsWith("/account")) return true;
      return false;
    });

    if (currentIdx > step.step - 1) return "done";
    return "pending";
  };

  return (
    <div className={styles.shell}>
      <Navbar />

      {showJourney && (
        <div className={styles.journey} role="navigation" aria-label="Rezervasiya addımları">
          <div className={styles.journeyInner}>
            {JOURNEY_STEPS.map((step, i) => {
              const status = getStepStatus(step);
              return (
                <span key={step.step} style={{ display: "contents" }}>
                  {i > 0 && <span className={styles.journeyArrow} aria-hidden="true">→</span>}
                  <Link
                    href={step.href === "/cars" ? "/fleet" : step.href}
                    className={`${styles.journeyStep} ${
                      status === "active" ? styles.journeyStepActive : ""
                    } ${status === "done" ? styles.journeyStepDone : ""}`}
                  >
                    <span className={styles.stepNum}>
                      {status === "done" ? "✓" : step.step}
                    </span>
                    {step.label}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.body}>
        <main className={styles.main}>
          {sidebar ? (
            <div className={`${styles.fleetLayout} ${styles.fleetLayoutWithSidebar}`}>
              <aside className={styles.sidebar}>{sidebar}</aside>
              <div className={styles.content}>{children}</div>
            </div>
          ) : (
            children
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
              <div className={styles.footerBrand}>
                Drive<span>AZ</span>
              </div>
              <p className={styles.footerText}>
                Azərbaycanda premium avtomobil icarəsi. Sürətli rezervasiya, geniş park, 24/7 dəstək.
              </p>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Səhifələr</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="/fleet">Avtomobil parkı</Link></li>
                <li><Link href="/booking">Rezervasiya</Link></li>
                <li><Link href="/account">Hesabım</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Əlaqə</h4>
              <ul className={styles.footerLinks}>
                <li><a href="tel:+994501234567">+994 50 123 45 67</a></li>
                <li><a href="mailto:info@driveaz.az">info@driveaz.az</a></li>
                <li>Bakı, Azərbaycan</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © {new Date().getFullYear()} DriveAZ. Bütün hüquqlar qorunur.
          </div>
        </footer>
      </div>
    </div>
  );
}
