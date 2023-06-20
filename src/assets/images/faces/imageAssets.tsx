declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (
    paths: string[],
    callback: (require: <T>(path: string) => T) => void
  ) => void;
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => any;
};

function importAll(r: { keys(): string[]; (key: string): any }) {
  return r.keys().map(r);
}

export const images = importAll(
  require.context("./", false, /\.(png|jpe?g|svg)$/)
);
