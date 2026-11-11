import entries from "./entries.json.js";
const manifest = entries;
const packageNames = {
  base: "aheart-ui",
  ai: "@aheart-ui/ai",
  dnd: "@aheart-ui/dnd"
};
const aheartComponentEntries = Object.keys(packageNames).flatMap((domain) => manifest[domain].flatMap(({ subpath, name, names = [], sideEffects = [] }) => {
  const from = `${packageNames[domain]}/${subpath}`;
  return (name ? [name] : names).map((name2) => ({
    domain,
    name: name2,
    from,
    styles: [`${from}/style.css`, ...sideEffects]
  }));
}));
export {
  aheartComponentEntries
};
