declare module 'plotly.js-basic-dist-min' {
  const Plotly: {
    react: (
      element: HTMLDivElement,
      data: unknown[],
      layout: Record<string, unknown>,
      config: Record<string, unknown>,
    ) => Promise<unknown>
    purge: (element: HTMLDivElement) => void
  }

  export default Plotly
}
