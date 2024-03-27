export const breakpoint = (size: string) => {
    if (size === "xl") return (str: string) => str;
    return (str: string) => null;
};