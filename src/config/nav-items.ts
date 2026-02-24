export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export const navItems: NavItem[] = [
  // {
  //   title: "Insights",
  //   href: "/insights",
  //   icon: "Lightbulb",
  // },
  {
    title: "Code Health",
    href: "/code-health",
    icon: "Dashboard",
  },
  {
    title: "Heatmap",
    href: "/heatmap",
    icon: "Analytics",
  },
  {
    title: "Code View",
    href: "/code-view",
    icon: "Code",
  },
  /* {
    title: "API Analysis",
    href: "/api-analysis",
    icon: "Hub",
  },
  {
    title: "Performance",
    href: "/performance",
    icon: "Speed",
  },
   */
  /*  {
     title: "Visualization",
     href: "/visualization",
     icon: "ViewQuilt",
   }, */
  {
    title: "Relationship",
    href: "/relationship",
    icon: "AccountTree",
  },
  /*  {
     title: "Downloads",
     href: "/downloads",
     icon: "Description",
   }, */
];
