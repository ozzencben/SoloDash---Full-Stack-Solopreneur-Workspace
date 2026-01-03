"use client";

import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/AuthContext";
import { authServices } from "@/services/authService";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authServices.login({
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", result.token);

      login(result.user);

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Giriş başarısız.";
        setError(serverMessage);
      } else {
        setError("Beklenmedik bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome</h1>
          <p className={styles.subtitle}>Enter your information to continue.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formItem}>
            <Icon name="mail" color="var(--secondary)" size={20} />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className={styles.formItem}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <Icon
              name={showPassword ? "eyeClose" : "eyeOpen"}
              color="var(--secondary)"
              size={20}
              className={styles.eyeIcon}
              onClick={(e) => {
                e.preventDefault();
                togglePasswordVisibility();
              }}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.prompt}>
          <p className={styles.text}>Don&apos;t have an account?</p>
          <Link className={styles.link} href="/register">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
