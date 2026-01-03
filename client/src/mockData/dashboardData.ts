export interface DashboardStat {
  id: number;
  title: string;
  value: string | number;
  trend: string;
  // Buradaki liste, hata mesajındaki liste ile birebir aynı olmalı
  icon:
    | "folder"
    | "statistics"
    | "subscription"
    | "settings"
    | "feedback"
    | "help"
    | "logout"
    | "check"
    | "star"
    | "search"
    | "mail"
    | "eyeOpen"
    | "eyeClose"
    | "user"
    | "dashboard"
    | "notification";
  color: string;
}

export const DASHBOARD_STATS = [
  {
    id: 1,
    title: "Active Projects",
    value: "12",
    trend: "+2 this month",
    icon: "folder",
    color: "#2563eb",
  },
  {
    id: 2,
    title: "Total Revenue",
    value: "$4,500",
    trend: "%12 increase",
    icon: "subscription",
    color: "#059669",
  },
  {
    id: 3,
    title: "Completed Tasks",
    value: "128",
    trend: "This week 14",
    icon: "check",
    color: "#7c3aed",
  },
  {
    id: 4,
    title: "Customer Satisfaction",
    value: "%98",
    trend: "High",
    icon: "star",
    color: "#db2777",
  },
];

export const REVENUE_CHART_DATA = [
  { name: "Jub", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 3800 },
];

export const RECENT_PROJECTS = [
  {
    id: 1,
    name: "Solopreneur SaaS",
    status: "Completed",
    date: "2025-12-28",
    amount: "$120",
  },
  {
    id: 2,
    name: "E-Commerce Dashboard",
    status: "Pending",
    date: "2025-12-29",
    amount: "$450",
  },
  {
    id: 3,
    name: "Mobile App",
    status: "In Progress",
    date: "2025-12-30",
    amount: "$300",
  },
];

export const ALL_PROJECTS = [
  {
    id: 1,
    name: "Solopreneur SaaS",
    status: "Completed",
    date: "2025-12-28",
    amount: "$120",
    category: "Web App",
  },
  {
    id: 2,
    name: "E-Commerce Dashboard",
    status: "In Progress",
    date: "2025-12-29",
    amount: "$450",
    category: "Dashboard",
  },
  {
    id: 3,
    name: "Mobile App",
    status: "Pending",
    date: "2025-12-30",
    amount: "$300",
    category: "Mobile",
  },
  {
    id: 4,
    name: "SEO Optimization",
    status: "Completed",
    date: "2025-12-25",
    amount: "$200",
    category: "Marketing",
  },
  {
    id: 5,
    name: "Landing Page Design",
    status: "In Progress",
    date: "2025-12-20",
    amount: "$150",
    category: "Design",
  },
];

export const CATEGORY_DISTRIBUTION = [
  { name: "Web App", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Design", value: 200 },
  { name: "Marketing", value: 100 },
];

export const MONTHLY_EXPENSES = [
  { month: "Oca", amount: 200 },
  { month: "Şub", amount: 450 },
  { month: "Mar", amount: 300 },
  { month: "Nis", amount: 900 },
];

export const PRICING_PLANS = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["3 Active Project", "Basic Statistics", "Community Support"],
    buttonText: "Current Plan",
    current: true,
  },
  {
    id: 2,
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited Projects",
      "Detailed Analyzes",
      "Priority Support",
      "Special Export Options",
    ],
    buttonText: "Upgrade to Pro",
    current: false,
    recommended: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$49",
    period: "/month",
    features: [
      "Team Management",
      "API Access",
      "7/24 Live Support",
      "White-label Reporting",
    ],
    buttonText: "Contact us",
    current: false,
  },
];
