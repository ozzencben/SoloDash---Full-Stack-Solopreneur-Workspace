"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Icon } from "@/components/icons/icon";

const FAQS = [
  { q: "How can I export my projects?", a: "You can export as a CSV or JSON file from the 'Edit' menu on the Projects page." },
  { q: "Can I cancel my subscription at any time?", a: "Yes, you can cancel your subscription at any time from the Subscription page." },
  { q: "Are my data safe?", a: "All your data is end-to-end encrypted and backed up daily." }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Help Center</h1>
      <div className={styles.faqList}>
        {FAQS.map((faq, index) => (
          <div key={index} className={styles.faqItem} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <div className={styles.question}>
              <span>{faq.q}</span>
              <Icon name="plus" size={16} />
            </div>
            {openIndex === index && <div className={styles.answer}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}