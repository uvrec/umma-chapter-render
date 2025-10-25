// Type declarations for sanscript package
declare module 'sanscript' {
  interface SanscriptModule {
    t(text: string, from: string, to: string, options?: any): string;
  }
  
  const Sanscript: SanscriptModule;
  export default Sanscript;
}