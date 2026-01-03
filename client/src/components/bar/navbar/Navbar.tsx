"use client";

import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import styles from "./Navbar.module.css";

function UserAvatar({ name }: { name?: string }) {
  if (!name) return null;

  const usernameShort = name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  return <span className={styles.username}>{usernameShort}</span>;
}

const NoSSRUserAvatar = dynamic(() => Promise.resolve(UserAvatar), {
  ssr: false,
});

function Navbar({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  const router = useRouter();

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const { user } = useAuth();

  return (
    <header className={styles.navbar}>
      {isDashboard && (
        <>
          <div className={styles.menuBtnContainer}>
            <button
              className={`${styles.menuBtn} ${isOpen ? styles.open : ""}`}
              onClick={onClick}
              aria-label="Menüyü Aç/Kapat"
            >
              <div className={styles.hamburgerBox}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            </button>
          </div>

          <input className={styles.input} type="text" placeholder="Search..." />

          <div className={styles.rightSide}>
            <button className={styles.button}>
              <Icon name="search" size={20} color="var(--text-color-primary)" />
            </button>
            <button className={styles.button}>
              <Icon
                name="notification"
                size={20}
                color="var(--text-color-primary)"
              />
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className={styles.button}
            >
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={30}
                  height={30}
                  className={styles.avatar}
                  priority
                  sizes="(max-width: 768px) 100vw, 140px"
                />
              ) : (
                <NoSSRUserAvatar name={user?.name} />
              )}
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default React.memo(Navbar);
