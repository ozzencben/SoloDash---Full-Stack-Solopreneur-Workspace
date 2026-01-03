// src/app/dashboard/profile/page.tsx
"use client";

import { Project, useAuth } from "@/context/AuthContext";
import Image from "next/image";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.profileMain}>
          <div className={styles.avatarContainer}>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name || "User"}
                width={140}
                height={140}
                className={styles.avatar}
                priority
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.initials}>
                  {user.name
                    .split(" ")
                    .map((name) => name.charAt(0))
                    .join("")}
                </span>
              </div>
            )}
          </div>
          <div className={styles.userText}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.titleText}>
              {user.title || "Full Stack Developer"}
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>PRO</span>
              <span className={styles.badge}>{user.role || "Member"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <aside className={styles.sidebar}>
          <section className={styles.card}>
            <h3>About Me</h3>
            <p className={styles.bioText}>
              {user.bio ||
                "No biography has been added yet. You can update your profile in the settings section."}
            </p>
          </section>

          <section className={styles.card}>
            <h3>Contact</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </div>
          </section>
        </aside>

        <main className={styles.mainContent}>
          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <h3>Featured Projects</h3>
              <span className={styles.projectCount}>
                {user.projects?.length || 0} Project
              </span>
            </div>

            <div className={styles.projectList}>
              {user.projects && user.projects.length > 0 ? (
                user.projects.map((project: Project) => (
                  <div key={project.id} className={styles.projectItem}>
                    <div className={styles.projectInfo}>
                      <h4>{project.title}</h4>
                      <p className={styles.category}>
                        {project.category || "General Project"}
                      </p>
                    </div>
                    <div className={styles.projectMeta}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[project.status.toLowerCase()] || ""
                        }`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                      <span className={styles.budget}>${project.budget}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>You don&apos; t have any projects added yet.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
