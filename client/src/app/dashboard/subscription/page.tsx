"use client";

import { Icon } from "@/components/icons/icon";
import { PRICING_PLANS } from "@/mockData/dashboardData";
import styles from "./page.module.css";

export default function SubscriptionPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Subscription Management</h1>
        <p className={styles.subtitle}>
          Choose the plan that best suits your needs and grow your business.
        </p>
      </div>

      <div className={styles.pricingGrid}>
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${
              plan.recommended ? styles.recommended : ""
            } ${plan.current ? styles.current : ""}`}
          >
            {plan.recommended && (
              <span className={styles.badge}>Most Popular</span>
            )}

            <div className={styles.planHeader}>
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
            </div>

            <ul className={styles.featureList}>
              {plan.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <Icon name="check" size={16} color="var(--primary)" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`${styles.planBtn} ${
                plan.current ? styles.currentBtn : ""
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
