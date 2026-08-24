"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  Clock3,
  Gift,
  GraduationCap,
  LockKeyhole,
  Package,
  Plus,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
  X,
} from "lucide-react";
import type { CurrentUserProfile } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import { Modal, SkillHourBadge } from "./ui";

type SkillHoursViewProps = {
  profile: CurrentUserProfile;
  onTeach: () => void;
};

type PackageId = "single" | "popular" | "value";

type ActivityFilter =
  | "all"
  | "earned"
  | "spent"
  | "purchased"
  | "held"
  | "returned";

const transactions = [
  {
    id: "welcome",
    type: "welcome",
    filter: "earned",
    amount: 1,
    dateKey: "skillHoursView.activity.today",
  },
  {
    id: "teaching",
    type: "earned",
    filter: "earned",
    amount: 1,
    dateKey: "skillHoursView.activity.yesterday",
  },
  {
    id: "learning",
    type: "spent",
    filter: "spent",
    amount: -1,
    dateKey: "skillHoursView.activity.aug18",
  },
  {
    id: "purchase",
    type: "purchased",
    filter: "purchased",
    amount: 3,
    dateKey: "skillHoursView.activity.aug12",
  },
  {
    id: "booking-held",
    type: "held",
    filter: "held",
    amount: -1,
    dateKey: "skillHoursView.activity.aug10",
  },
  {
    id: "returned",
    type: "returned",
    filter: "returned",
    amount: 1,
    dateKey: "skillHoursView.activity.aug08",
  },
  {
    id: "plus",
    type: "subscription",
    filter: "earned",
    amount: 2,
    dateKey: "skillHoursView.activity.aug01",
  },
] as const;

const packages = [
  {
    id: "single" as const,
    hours: 1,
    price: "€3,49",
    popular: false,
  },
  {
    id: "popular" as const,
    hours: 3,
    price: "€8,49",
    popular: true,
  },
  {
    id: "value" as const,
    hours: 6,
    price: "€16,99",
    popular: false,
  },
] as const;

export function SkillHoursView({
  profile,
  onTeach,
}: SkillHoursViewProps) {
  const { t } = useI18n();
  const [selectedPackage, setSelectedPackage] =
    useState<PackageId | null>(null);
  const [plusOpen, setPlusOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityFilter, setActivityFilter] =
    useState<ActivityFilter>("all");

  const activePackage =
    packages.find((item) => item.id === selectedPackage) ?? null;

  const filteredTransactions =
    activityFilter === "all"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.filter === activityFilter,
        );

  function transactionIcon(type: string) {
    switch (type) {
      case "welcome":
        return <Gift size={17} />;
      case "earned":
        return <ArrowDownLeft size={17} />;
      case "spent":
        return <ArrowUpRight size={17} />;
      case "purchased":
        return <Package size={17} />;
      case "held":
        return <LockKeyhole size={17} />;
      case "returned":
        return <Repeat2 size={17} />;
      case "subscription":
        return <Star size={17} />;
      default:
        return <Repeat2 size={17} />;
    }
  }

  return (
    <>
      <section className="skill-hours-view">
        <header className="skill-hours-view__header">
          <div>
            <span className="app-kicker">
              {t("skillHoursView.kicker")}
            </span>

            <h1>{t("skillHoursView.title")}</h1>

            <p>{t("skillHoursView.copy")}</p>
          </div>

          <SkillHourBadge balance={profile.skillHours.toFixed(1)} />
        </header>

        <div className="skill-hours-desktop-grid">
          <div className="skill-hours-primary">
            <div className="skill-hours-balance-grid">
              <section className="skill-hours-balance-card skill-hours-balance-card--available">
                <div className="skill-hours-balance-card__icon">
                  <WalletCards size={24} />
                </div>

                <div>
                  <span>{t("skillHoursView.balance.available")}</span>

                  <strong>
                    {profile.skillHours.toFixed(1)}
                    <small> SH</small>
                  </strong>

                  <p>{t("skillHoursView.balance.availableCopy")}</p>
                </div>
              </section>

              <section className="skill-hours-balance-card skill-hours-balance-card--held">
                <div className="skill-hours-balance-card__icon">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <span>{t("skillHoursView.balance.held")}</span>

                  <strong>
                    1.0
                    <small> SH</small>
                  </strong>

                  <p>{t("skillHoursView.balance.heldCopy")}</p>
                </div>
              </section>
            </div>

            <div className="skill-hours-main-row">
              <section className="skill-hours-panel skill-hours-get-more">
                <div className="skill-hours-panel__heading">
                  <div>
                    <span className="app-kicker">
                      {t("skillHoursView.getMore.kicker")}
                    </span>

                    <h2>{t("skillHoursView.getMore.title")}</h2>
                  </div>
                </div>

                <div className="skill-hours-earn-card">
                  <span className="skill-hours-earn-card__icon">
                    <GraduationCap size={25} />
                  </span>

                  <div>
                    <strong>
                      {t("skillHoursView.getMore.teach.title")}
                    </strong>

                    <p>{t("skillHoursView.getMore.teach.copy")}</p>
                  </div>

                  <button type="button" onClick={onTeach}>
                    <Plus size={16} />
                    {t("skillHoursView.getMore.teach.action")}
                  </button>
                </div>

                <div className="skill-hours-packages">
                  {packages.map((item) => (
                    <article
                      className={`skill-hours-package ${
                        item.popular ? "is-popular" : ""
                      }`}
                      key={item.id}
                    >
                      {item.popular && (
                        <span className="skill-hours-package__popular">
                          <Sparkles size={12} />
                          {t("skillHoursView.packages.popular")}
                        </span>
                      )}

                      <span className="skill-hours-package__hours">
                        {item.hours}
                        <small> SH</small>
                      </span>

                      <strong>{item.price}</strong>

                      <p>
                        {t(
                          item.id === "popular"
                            ? "skillHoursView.packages.popularCopy"
                            : `skillHoursView.packages.${item.id}`,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedPackage(item.id)}
                      >
                        {t("skillHoursView.packages.action")}
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="skill-hours-plus-card">
                <div className="skill-hours-plus-card__top">
                  <span>
                    <Star size={18} fill="currentColor" />
                    YUNO PLUS
                  </span>

                  <strong>€15,99</strong>
                  <small>{t("skillHoursView.plus.perMonth")}</small>
                </div>

                <div className="skill-hours-plus-card__reward">
                  <Clock3 size={21} />
                  <strong>+6 SH</strong>
                  <span>{t("skillHoursView.plus.monthly")}</span>
                </div>

                <ul>
                  <li>
                    <Sparkles size={15} />
                    {t("skillHoursView.plus.benefitHours")}
                  </li>

                  <li>
                    <Star size={15} />
                    {t("skillHoursView.plus.benefitBadge")}
                  </li>

                  <li>
                    <ArrowUpRight size={15} />
                    {t("skillHoursView.plus.benefitVisibility")}
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => setPlusOpen(true)}
                >
                  {t("skillHoursView.plus.action")}
                </button>

                <p>{t("skillHoursView.plus.note")}</p>
              </section>
            </div>
          </div>

          <aside className="skill-hours-layout__side">
            <section className="skill-hours-how-card">
              <span className="skill-hours-how-card__icon">
                <ShieldCheck size={21} />
              </span>

              <span className="app-kicker">
                {t("skillHoursView.how.kicker")}
              </span>

              <h2>{t("skillHoursView.how.title")}</h2>

              <div>
                <p>
                  <GraduationCap size={16} />
                  <span>
                    <strong>{t("skillHoursView.how.teach")}</strong>
                    {t("skillHoursView.how.teachCopy")}
                  </span>
                </p>

                <p>
                  <CalendarClock size={16} />
                  <span>
                    <strong>{t("skillHoursView.how.book")}</strong>
                    {t("skillHoursView.how.bookCopy")}
                  </span>
                </p>

                <p>
                  <Repeat2 size={16} />
                  <span>
                    <strong>{t("skillHoursView.how.repeat")}</strong>
                    {t("skillHoursView.how.repeatCopy")}
                  </span>
                </p>
              </div>
            </section>

            <section className="skill-hours-panel skill-hours-activity">
              <div className="skill-hours-panel__heading">
                <div>
                  <span className="app-kicker">
                    {t("skillHoursView.activity.kicker")}
                  </span>

                  <h2>{t("skillHoursView.activity.title")}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivityFilter("all");
                    setActivityOpen(true);
                  }}
                >
                  {t("skillHoursView.activity.all")}
                </button>
              </div>

              <div className="skill-hours-transactions">
                {transactions.map((transaction) => (
                  <article
                    className={`skill-hours-transaction skill-hours-transaction--${transaction.type}`}
                    key={transaction.id}
                  >
                    <span className="skill-hours-transaction__icon">
                      {transactionIcon(transaction.type)}
                    </span>

                    <div className="skill-hours-transaction__copy">
                      <strong>
                        {t(
                          `skillHoursView.activity.${transaction.type}.title`,
                        )}
                      </strong>

                      <span>
                        {t(
                          `skillHoursView.activity.${transaction.type}.copy`,
                        )}
                      </span>
                    </div>

                    <div className="skill-hours-transaction__value">
                      <strong>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount} SH
                      </strong>

                      <span>{t(transaction.dateKey)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>

      {activityOpen && (
        <Modal
          ariaLabel={t("skillHoursView.activityModal.aria")}
          className="skill-hours-modal skill-hours-modal--activity"
        >
          <button
            className="skill-hours-modal__close"
            type="button"
            onClick={() => setActivityOpen(false)}
            aria-label={t("skillHoursView.modal.close")}
          >
            <X size={18} />
          </button>

          <span className="app-kicker">
            {t("skillHoursView.activityModal.kicker")}
          </span>

          <h2>{t("skillHoursView.activityModal.title")}</h2>

          <p>{t("skillHoursView.activityModal.copy")}</p>

          <div className="skill-hours-activity-filters">
            {(
              [
                "all",
                "earned",
                "spent",
                "purchased",
                "held",
                "returned",
              ] as ActivityFilter[]
            ).map((filter) => (
              <button
                key={filter}
                type="button"
                className={
                  activityFilter === filter ? "is-active" : ""
                }
                onClick={() => setActivityFilter(filter)}
              >
                {t(`skillHoursView.activityModal.filters.${filter}`)}
              </button>
            ))}
          </div>

          <div className="skill-hours-modal-transactions">
            {filteredTransactions.length ? (
              filteredTransactions.map((transaction) => (
                <article
                  className={`skill-hours-transaction skill-hours-transaction--${transaction.type}`}
                  key={transaction.id}
                >
                  <span className="skill-hours-transaction__icon">
                    {transactionIcon(transaction.type)}
                  </span>

                  <div className="skill-hours-transaction__copy">
                    <strong>
                      {t(
                        `skillHoursView.activity.${transaction.type}.title`,
                      )}
                    </strong>

                    <span>
                      {t(
                        `skillHoursView.activity.${transaction.type}.copy`,
                      )}
                    </span>
                  </div>

                  <div className="skill-hours-transaction__value">
                    <strong>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} SH
                    </strong>

                    <span>{t(transaction.dateKey)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="skill-hours-activity-empty">
                <Clock3 size={24} />
                <strong>
                  {t("skillHoursView.activityModal.emptyTitle")}
                </strong>
                <span>
                  {t("skillHoursView.activityModal.emptyCopy")}
                </span>
              </div>
            )}
          </div>

          <button
            className="skill-hours-modal__secondary"
            type="button"
            onClick={() => setActivityOpen(false)}
          >
            {t("skillHoursView.modal.back")}
          </button>
        </Modal>
      )}

      {activePackage && (
        <Modal
          ariaLabel={t("skillHoursView.buyModal.aria")}
          className="skill-hours-modal"
        >
          <button
            className="skill-hours-modal__close"
            type="button"
            onClick={() => setSelectedPackage(null)}
            aria-label={t("skillHoursView.modal.close")}
          >
            <X size={18} />
          </button>

          <div className="skill-hours-modal__icon">
            <Clock3 size={24} />
          </div>

          <span className="app-kicker">
            {t("skillHoursView.buyModal.kicker")}
          </span>

          <h2>{t("skillHoursView.buyModal.title")}</h2>

          <div className="skill-hours-modal__purchase">
            <strong>
              {activePackage.hours} SH
            </strong>
            <span>{activePackage.price}</span>
          </div>

          <p>{t("skillHoursView.buyModal.copy")}</p>

          <div className="skill-hours-modal__notice">
            <ShieldCheck size={18} />
            <span>{t("skillHoursView.buyModal.preview")}</span>
          </div>

          <button
            className="skill-hours-modal__primary"
            type="button"
            disabled
          >
            {t("skillHoursView.buyModal.checkout")}
          </button>

          <button
            className="skill-hours-modal__secondary"
            type="button"
            onClick={() => setSelectedPackage(null)}
          >
            {t("skillHoursView.modal.back")}
          </button>
        </Modal>
      )}

      {plusOpen && (
        <Modal
          ariaLabel={t("skillHoursView.plusModal.aria")}
          className="skill-hours-modal skill-hours-modal--plus"
        >
          <button
            className="skill-hours-modal__close"
            type="button"
            onClick={() => setPlusOpen(false)}
            aria-label={t("skillHoursView.modal.close")}
          >
            <X size={18} />
          </button>

          <div className="skill-hours-modal__plus-badge">
            <Star size={16} fill="currentColor" />
            YUNO PLUS
          </div>

          <h2>{t("skillHoursView.plusModal.title")}</h2>

          <div className="skill-hours-modal__plus-price">
            <strong>€15,99</strong>
            <span>{t("skillHoursView.plus.perMonth")}</span>
          </div>

          <div className="skill-hours-modal__plus-hours">
            <Clock3 size={21} />
            <strong>6 SH</strong>
            <span>{t("skillHoursView.plusModal.hours")}</span>
          </div>

          <div className="skill-hours-modal__plus-intro">
            <Check size={17} />
            <span>{t("skillHoursView.plus.benefitHours")}</span>
          </div>

          <h3 className="skill-hours-modal__features-title">
            {t("skillHoursView.plusModal.featuresTitle")}
          </h3>

          <div className="skill-hours-modal__feature-grid">
            <article>
              <Sparkles size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.boostTitle")}</strong>
                <span>{t("skillHoursView.plusModal.boostCopy")}</span>
              </div>
            </article>

            <article>
              <ArrowUpRight size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.superConnectTitle")}</strong>
                <span>{t("skillHoursView.plusModal.superConnectCopy")}</span>
              </div>
            </article>

            <article>
              <Star size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.savedTitle")}</strong>
                <span>{t("skillHoursView.plusModal.savedCopy")}</span>
              </div>
            </article>

            <article>
              <Repeat2 size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.undoTitle")}</strong>
                <span>{t("skillHoursView.plusModal.undoCopy")}</span>
              </div>
            </article>

            <article>
              <ShieldCheck size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.filtersTitle")}</strong>
                <span>{t("skillHoursView.plusModal.filtersCopy")}</span>
              </div>
            </article>

            <article>
              <GraduationCap size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.insightsTitle")}</strong>
                <span>{t("skillHoursView.plusModal.insightsCopy")}</span>
              </div>
            </article>

            <article>
              <Sparkles size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.matchesTitle")}</strong>
                <span>{t("skillHoursView.plusModal.matchesCopy")}</span>
              </div>
            </article>

            <article>
              <Star size={17} />
              <div>
                <strong>{t("skillHoursView.plusModal.personalizationTitle")}</strong>
                <span>{t("skillHoursView.plusModal.personalizationCopy")}</span>
              </div>
            </article>
          </div>

          <p className="skill-hours-modal__more">
            {t("skillHoursView.plusModal.more")}
          </p>

          <div className="skill-hours-modal__notice">
            <ShieldCheck size={18} />
            <span>{t("skillHoursView.plusModal.preview")}</span>
          </div>

          <button
            className="skill-hours-modal__primary"
            type="button"
            disabled
          >
            {t("skillHoursView.plusModal.subscribe")}
          </button>

          <button
            className="skill-hours-modal__secondary"
            type="button"
            onClick={() => setPlusOpen(false)}
          >
            {t("skillHoursView.modal.back")}
          </button>
        </Modal>
      )}
    </>
  );
}
