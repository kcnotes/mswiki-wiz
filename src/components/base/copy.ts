export const copy = (text?: string) => {
  if (text != null) {
    navigator.clipboard.writeText(text);
  }
};