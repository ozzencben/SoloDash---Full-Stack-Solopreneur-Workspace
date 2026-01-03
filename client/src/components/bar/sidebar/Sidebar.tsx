"use client";

import { Icon } from "@/components/icons/icon";
import { IconName } from "@/components/icons/lib";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Sidebar.module.css";

interface SidebarLinks {
  name: string;
  icon: IconName;
}

function Sidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const links: SidebarLinks[] = [
    { name: "Dashboard", icon: "dashboard" },
    { name: "Projects", icon: "folder" },
    { name: "Statistics", icon: "statistics" },
    { name: "Subscription", icon: "subscription" },
  ];

  const bottomLinks: SidebarLinks[] = [
    { name: "Settings", icon: "settings" },
    { name: "Feedback", icon: "feedback" },
    { name: "Help", icon: "help" },
    { name: "Logout", icon: "logout" },
  ];

  const copyRight = [
    { name: "Contact Us" },
    { name: "About Us" },
    { name: "Cookie Policy" },
    { name: "Privacy Policy" },
    { name: "Terms of Service" },
    { name: "© 2023 Solo Preneur. All rights reserved." },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Linklere tıklandığında sidebar'ı kapatır/daraltır
  const handleLinkClick = () => {
    closeSidebar();
  };

  const handleRoute = (name: string) => {
    closeSidebar();

    if (name === "Dashboard") {
      return router.push("/dashboard");
    }

    if (name === "Logout") {
      return handleLogout();
    }

    router.push(`/dashboard/${name.toLowerCase()}`);
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.open : styles.collapsed
        }`}
      >
        <div className={styles.sidebarScrollContent}>
          <div className={styles.logo}>{isOpen ? "Solo Preneur" : "SP"}</div>

          <div className={styles.seperator}></div>

          <nav className={styles.navContainer}>
            <ul className={styles.linkList}>
              {links.map((link, index) => (
                <li
                  key={index}
                  className={styles.link}
                  onClick={() => {
                    handleLinkClick();
                    handleRoute(link.name);
                  }}
                >
                  <div className={styles.iconBox}>
                    <Icon
                      name={link.icon}
                      color="var(--text-color-primary)"
                      size={20}
                    />
                  </div>
                  <span className={styles.linkText}>{link.name}</span>
                  <span className={styles.linkHoverText}>{link.name}</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.seperator}></div>

          <nav className={styles.navContainer}>
            <ul className={styles.linkList}>
              {bottomLinks.map((link, index) => (
                <li
                  key={index}
                  className={styles.link}
                  onClick={() => {
                    handleLinkClick();
                    handleRoute(link.name);
                  }}
                >
                  <div className={styles.iconBox}>
                    <Icon
                      name={link.icon}
                      color="var(--text-color-primary)"
                      size={20}
                    />
                  </div>
                  <span className={styles.linkText}>{link.name}</span>
                  <span className={styles.linkHoverText}>{link.name}</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.seperator}></div>

          <footer className={styles.copyright}>
            <div className={styles.copyrightWrapper}>
              {copyRight.map((item, index) => (
                <span key={index} className={styles.copyrightText}>
                  {item.name}
                </span>
              ))}
            </div>
          </footer>
        </div>
      </aside>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={closeSidebar}
      ></div>
    </>
  );
}

export default React.memo(Sidebar);
