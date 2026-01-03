"use client";

import { calculateChartData } from "@/components/dashboard/revenueChart/calculateChartData";
import { RevenueChart } from "@/components/dashboard/revenueChart/RevenueChart";
import { calculateDashboardStats } from "@/components/dashboard/statsCard/calculateDashboardStats";
import StatsCard from "@/components/dashboard/statsCard/StatsCard";
import { IconName } from "@/components/icons/lib";
import { Project, projectService } from "@/services/projectService";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getMyProjects();
      setProjects(res.projects || []);
    } catch (error) {
      console.error("Projects could not be loaded:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const dashboardStats = calculateDashboardStats(projects);
  const chartData = calculateChartData(projects);

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon as IconName}
            color={stat.color}
          />
        ))}
      </div>

      <div className={styles.revenueChartContainer}>
        <RevenueChart data={chartData} />
      </div>

      {/* Grafikten hemen sonra */}
      <div className={styles.tableContainer}>
        <h3 className={styles.title}>Last Projects</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString("tr-TR")
                    : "-"}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      project.status === "COMPLETED"
                        ? styles.completed
                        : project.status === "IN_PROGRESS"
                        ? styles.processing
                        : styles.pending
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>{project.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
