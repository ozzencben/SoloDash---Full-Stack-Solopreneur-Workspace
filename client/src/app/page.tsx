"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const faqs = [
    {
      q: "What exactly is SoloDash?",
      a: "SoloDash is an all-in-one workspace designed specifically for solopreneurs and freelancers to manage their projects, finances, and public portfolios from a single dashboard.",
    },
    {
      q: "How does the portfolio feature work?",
      a: "The projects you add to your dashboard are automatically listed on your professional profile page. You can share your profile link with potential clients to showcase your work instantly.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use industry-standard encryption to ensure your data is stored securely and is only accessible by you.",
    },
    {
      q: "Is it free to use?",
      a: "During our MVP phase, all core features are free. We plan to introduce premium features and PRO plans as we evolve to better serve your growing business.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          SoloDash<span>.</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.loginBtn}>
            Sign In
          </Link>
          <Link href="/register" className={styles.registerBtn}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <h1>
          Turn Your Ideas into{" "}
          <span className={styles.gradientText}>Reality</span>
        </h1>
        <p>
          Organize your projects, track your budget, and impress clients with a
          professional portfolio. Stop the chaos, start building.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/register" className={styles.mainCta}>
            Start Your Journey
          </Link>
          <Link href="#features" className={styles.subCta}>
            Explore Features
          </Link>
        </div>
      </header>

      {/* How It Works */}
      <section className={styles.steps}>
        <div className={styles.sectionTitle}>
          <h2>Get Started in 3 Easy Steps</h2>
        </div>
        <div className={styles.stepGrid}>
          <div className={styles.stepItem}>
            <span className={styles.number}>01</span>
            <h3>Sign Up</h3>
            <p>
              Create your account in seconds and set up your personal workspace.
            </p>
          </div>
          <div className={styles.stepItem}>
            <span className={styles.number}>02</span>
            <h3>Add Projects</h3>
            <p>
              Input your ongoing or completed projects with budget and category
              details.
            </p>
          </div>
          <div className={styles.stepItem}>
            <span className={styles.number}>03</span>
            <h3>Share & Grow</h3>
            <p>
              Share your professional profile link and manage your business like
              a pro.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.sectionTitle}>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${
                activeFaq === index ? styles.active : ""
              }`}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className={styles.faqQuestion}>
                {faq.q}
                <span className={styles.arrow}>↓</span>
              </div>
              <div className={styles.faqAnswer}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              SoloDash<span>.</span>
            </div>
            <p>The digital workspace for modern independents.</p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <Link href="#features">Features</Link>
              <Link href="/register">Sign Up</Link>
            </div>
            <div>
              <h4>Community</h4>
              <Link href="https://github.com/ozenc">GitHub</Link>
              <Link href="https://linkedin.com">LinkedIn</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 SoloDash. All rights reserved. Built by Özenç Dönmezer.</p>
        </div>
      </footer>
    </div>
  );
}
