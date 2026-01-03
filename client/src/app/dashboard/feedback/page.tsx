"use client";

import styles from "./page.module.css";

export default function FeedbackPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Feedback</h1>
      <p className={styles.subtitle}>
        Help us improve Solo Preneur. Your ideas are valuable to us.
      </p>

      <div className={styles.card}>
        <form className={styles.form}>
          <div className={styles.group}>
            <label>Subject</label>
            <select>
              <option>Error Reporting</option>
              <option>Feature Recommendation</option>
              <option>Interface / Design</option>
              <option>Other</option>
            </select>
          </div>
          <div className={styles.group}>
            <label>Message</label>
            <textarea placeholder="How can we help?" rows={6}></textarea>
          </div>
          <button type="button" className={styles.sendBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
