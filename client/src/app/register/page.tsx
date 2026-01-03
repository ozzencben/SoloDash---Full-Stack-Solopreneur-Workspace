"use client";

import { Icon } from "@/components/icons/icon";
import { authServices } from "@/services/authService";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await authServices.register({
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
      });
      localStorage.setItem("token", result.token);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Kayıt olma başarısız.";
        setError(serverMessage);
      } else {
        setError("Beklenmedik bir hata oluştu.");
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
          <p className={styles.subtitle}>
            Please enter your information to register..
          </p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formItem}>
            <Icon name="user" color="var(--secondary)" size={20} />
            <input
              type="text"
              className={styles.input}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className={styles.formItem}>
            <Icon name="mail" color="var(--secondary)" size={20} />
            <input
              type="text"
              className={styles.input}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className={styles.formItem}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Icon
              name={showPassword ? "eyeClose" : "eyeOpen"}
              color="var(--secondary)"
              size={20}
              className={styles.eyeIcon}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                togglePasswordVisibility();
              }}
            />
          </div>
          <button type="submit" className={styles.button}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.prompt}>
          <p className={styles.text}>Do you already have an account?</p>
          <Link className={styles.link} href="/login">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
