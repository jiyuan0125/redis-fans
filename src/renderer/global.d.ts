declare module '*' {
  const value: any;
  export default value;
}

declare module 'font-list' {
  export const getFonts: () => Promise<string[]>;
}

interface Window {
  ResizeObserver: any;
}
