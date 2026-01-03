"use client";

import {
  calculateCategoryData,
  calculateMonthlyRevenue,
} from "@/app/dashboard/statistics/statsCalculator";
import { Project, projectService } from "@/services/projectService";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./page.module.css";

const COLORS = ["#2563eb", "#059669", "#7c3aed", "#db2777"];

export default function StatisticsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        setProjects(res.projects || []);
      } catch (error) {
        console.error("Statistics could not be loaded:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Grafik verilerini hesapla
  const revenueData = useMemo(
    () => calculateMonthlyRevenue(projects),
    [projects]
  );
  const categoryData = useMemo(
    () => calculateCategoryData(projects),
    [projects]
  );

  if (isLoading)
    return <div className={styles.loading}>Loading Statistics...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Performance Analytics</h1>

      <div className={styles.chartGrid}>
        {/* 1. Detaylı Gelir Analizi (Line Chart) */}
        <div className={styles.chartCard}>
          <h3>Monthly Income Increase</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--bar-border)"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Kategori Dağılımı (Pie Chart) */}
        <div className={styles.chartCard}>
          <h3>Project Categories</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
