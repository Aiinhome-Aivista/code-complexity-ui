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
  // {
  //   title: "Relationship",
  //   href: "/relationship",
  //   icon: "Polyline",
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
  /*  {
    title: "Code View",
    href: "/code-view",
    icon: "Code",
  }, */
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
  {
    title: "Report",
    href: "/report",
    icon: "Description",
  }, */
  {
    title: "Visualization",
    href: "/visualization",
    icon: "ViewQuilt",
  },
  /*   {
    title: "Flow",
    href: "/flow",
    icon: "AccountTree",
  }, */
];
