import { Project } from "@/services/projectService";

// Aylık Gelir Hesaplama (Line Chart için)
export const calculateMonthlyRevenue = (projects: Project[]) => {
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
  const monthlyData = months.map((month) => ({ name: month, revenue: 0 }));

  projects.forEach((project) => {
    const monthIndex = new Date(project.createdAt).getMonth();
    monthlyData[monthIndex].revenue += project.budget;
  });
  return monthlyData;
};

// Kategori Dağılımı Hesaplama (Pie Chart için)
export const calculateCategoryData = (projects: Project[]) => {
  const categories: Record<string, number> = {};

  projects.forEach((project) => {
    // Proje modelinde category yoksa 'General' veya backend'den gelen alanı kullanabilirsin
    const cat = project.category || "General";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));
};
