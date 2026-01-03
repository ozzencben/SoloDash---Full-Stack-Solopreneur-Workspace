"use client";

import Navbar from "@/components/bar/navbar/Navbar";
import Sidebar from "@/components/bar/sidebar/Sidebar";
import React, { useCallback, useState } from "react";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div
      className={`${styles.layoutContainer} ${
        !sidebarOpen ? styles.sidebarCollapsed : ""
      }`}
    >
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <div className={styles.rightWrapper}>
        <Navbar isOpen={sidebarOpen} onClick={handleToggleSidebar} />
        <div className={styles.mainContent}>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
