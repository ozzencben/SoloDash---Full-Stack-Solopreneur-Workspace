"use client";
import { Icon } from "@/components/icons/icon";
import { IconName } from "@/components/icons/lib";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: IconName;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  trend,
  icon,
  color,
}: StatsCardProps) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <h3 className={styles.value}>{value}</h3>
          <p className={styles.trend}>{trend}</p>
        </div>
        <div className={styles.iconContainer}>
          <Icon name={icon} size={32} color={color} />
        </div>
      </div>
    </div>
  );
}
