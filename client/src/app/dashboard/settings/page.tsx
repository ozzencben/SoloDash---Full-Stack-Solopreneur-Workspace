"use client";

import { Icon } from "@/components/icons/icon";
import { useAuth, User } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { userService } from "@/services/userServices";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { toggleTheme, theme } = useTheme();
  const { updateUser, user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profile, setProfile] = useState<Partial<User>>({
    name: "",
    email: "",
    title: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        title: user.title || "Freelancer",
        bio: user.bio || "I'm a freelancer.",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateUser(profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- YENİLENEN HANDLE FILE CHANGE ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Tip ve Boyut Kontrolü
      if (!file.type.startsWith("image/")) {
        alert("Lütfen geçerli bir görsel dosyası seçin.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Görsel boyutu 5MB'dan küçük olmalıdır.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          setIsLoading(true);

          // 2. Kendi Backend'imize gönderiyoruz
          const data = await userService.updateAvatar(base64Image);

          if (data.success) {
            // 3. State'i ve AuthContext'i güncelle
            setProfile((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));

            // Context'teki updateUser'ı çağırarak kalıcı olmasını sağlıyoruz
            await updateUser({ ...profile, avatarUrl: data.avatarUrl });

            alert("Profil fotoğrafı başarıyla güncellendi!");
          }
        } catch (error: unknown) {
          // any yerine unknown kullanıyoruz
          console.error("Yükleme hatası:", error);

          // Hata mesajını güvenli bir şekilde çekiyoruz
          let message = "Görsel yüklenirken bir hata oluştu.";
          if (error instanceof Error) message = error.message;

          alert(message);
        } finally {
          setIsLoading(false);
        }
      };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return <div className={styles.loading}>Loading user data...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.settingsGrid}>
        <div className={styles.settingsSidebar}>
          <button
            className={`${styles.sideBtn} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <Icon name="user" size={18} />
            <span>Profile</span>
          </button>
          <button className={styles.sideBtn}>
            <Icon name="notification" size={18} />
            <span>Notifications</span>
          </button>
          <button
            className={`${styles.sideBtn} ${
              activeTab === "security" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <Icon name="subscription" size={18} />
            <span>Security</span>
          </button>

          <div className={styles.divider}></div>

          <div className={styles.theme}>
            <button
              className={`${styles.themeBtn} ${
                theme === "light" ? styles.active : ""
              }`}
              onClick={theme === "dark" ? toggleTheme : undefined}
              disabled={theme === "light"}
            >
              <Icon name="sun" size={18} />
              <span>Light</span>
            </button>
            <button
              className={`${styles.themeBtn} ${
                theme === "dark" ? styles.active : ""
              }`}
              onClick={theme === "light" ? toggleTheme : undefined}
              disabled={theme === "dark"}
            >
              <Icon name="moon" size={18} />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div className={styles.contentCard}>
          {activeTab === "profile" ? (
            <section className={styles.section}>
              <h3>Profile Information</h3>
              <p className={styles.sectionDesc}>
                You can update your general information here.
              </p>

              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      className={styles.avatarImg}
                      alt="Avatar"
                      width={80}
                      height={80}
                      unoptimized
                      priority
                      sizes="(max-width: 768px) 100vw, 140px"
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {getInitials(profile.name || "User")}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="avatarInput"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.changeBtn}
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Change Photo"}
                </button>
              </div>

              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" value={profile.email || ""} disabled />
                </div>
                <div className={styles.inputGroup}>
                  <label>Title / Role</label>
                  <input
                    type="text"
                    value={profile.title || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, title: e.target.value })
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>About Me</label>
                  <textarea
                    rows={4}
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>
          ) : (
            <section className={styles.section}>
              <h3>Security Settings</h3>
              <form
                className={styles.form}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className={styles.inputGroup}>
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className={styles.inputGroup}>
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button type="submit" className={styles.saveBtn}>
                  Update Password
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
