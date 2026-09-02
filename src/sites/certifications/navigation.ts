import { articleCategories } from "./articles";

export type NavigationItem = { label: string; href: string };

export const primaryNavigation: NavigationItem[] = [
  { label: "자격증 찾기", href: "/certifications" },
  { label: "시험일정", href: "/schedules" },
  { label: "자격증 비교", href: "/compare" },
  { label: "글 목록", href: "/articles" },
];

export const articleCategoryNavigation: NavigationItem[] = articleCategories.map((category) => ({
  label: category.name,
  href: `/categories/${category.slug}`,
}));
