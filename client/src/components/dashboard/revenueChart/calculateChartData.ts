// src/components/dashboard/revenueChart/calculateChartData.ts
import { Project } from "@/services/projectService";

export const calculateChartData = (projects: Project[]) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Her ay için toplam geliri 0 olan bir obje oluştur
  const monthlyData = months.map((month) => ({ name: month, revenue: 0 }));

  projects.forEach((project) => {
    // Projenin oluşturulma tarihine göre ay indeksini bul
    const date = new Date(project.createdAt);
    const monthIndex = date.getMonth(); // 0-11 arası döner

    // O ayın toplam bütçesine ekle
    monthlyData[monthIndex].revenue += project.budget;
  });

  return monthlyData;
};
