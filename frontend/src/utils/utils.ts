export const truncate = (str: string, length: number = 25): string =>
  str?.length > length ? str.slice(0, length) + "…" : str;
