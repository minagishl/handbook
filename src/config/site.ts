export type HeaderLink = {
  label: string;
  href: string;
  /**
   * When true, the link opens in a new tab with noopener/referrer guards.
   */
  external?: boolean;
};

export const headerLinks: HeaderLink[] = [
  {
    label: "Documentation",
    href: "/",
    external: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/minagishl/handbook",
    external: true,
  },
];
