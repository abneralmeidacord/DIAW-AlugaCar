import React from 'react';

export default function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    diagonal: 'M5 19 19 5M5 5h14v14',
    search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    calendar: 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2ZM7 2v4m10-4v4M3 10h18',
    user: 'M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    users:
      'M16 21a6 6 0 0 0-12 0M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M17 4a3 3 0 0 1 0 6m1 5a5 5 0 0 1 3 5',
    check: 'm5 12 4 4L19 6',
    close: 'm6 6 12 12M6 18 18 6',
    heart: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 3 11 8 16 5-5 13-11 8-16Z',
    car: 'm5 5-3 8v7h3v-3h14v3h3v-7l-3-8H5ZM2 12h20M6 14h1m10 0h1',
    fuel: 'M4 3h9v18H4V3Zm0 7h9m3-5 3 3v9a2 2 0 0 0 4 0V9l-3-3',
    shield: 'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6l-9-4Zm-4 9 3 3 5-6',
    clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    file: 'M5 2h10l5 5v15H5V2Zm10 0v6h5M9 12h7m-7 4h7',
    logout: 'M10 3H3v18h7m5-14 5 5-5 5M8 12h12',
    chevron: 'm6 9 6 6 6-6',
    menu: 'M3 6h18M3 12h18M3 18h18',
    bank: 'm2 8 10-6 10 6H2Zm2 12h16M6 10v7m6-7v7m6-7v7M2 22h20',
    plus: 'M12 5v14M5 12h14',
    trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
    edit: 'm3 17 13-13 4 4L7 21H3v-4Zm11-11 4 4',
    spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7',
    info: 'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
