import { IconName } from "@/components/icons/lib";
import { Project } from "@/services/projectService";

export const calculateDashboardStats = (projects: Project[]) => {
  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const pendingProjects = projects.filter((p) => p.status === "PENDING").length;

  return [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      trend: "+12.5%", // Burası şimdilik sabit kalabilir veya ay bazlı hesaplanabilir
      icon: "subscription" as IconName,
      color: "blue",
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      trend: "In Progress",
      icon: "clock" as IconName, // İkon isimlerini kendi kütüphanene göre güncelle
      color: "orange",
    },
    {
      title: "Completed",
      value: completedProjects.toString(),
      trend: "Total Done",
      icon: "check" as IconName,
      color: "green",
    },
    {
      title: "Pending",
      value: pendingProjects.toString(),
      trend: "Awaiting",
      icon: "alert" as IconName,
      color: "purple",
    },
  ];
};
