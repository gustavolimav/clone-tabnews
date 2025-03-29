export default function isFeatureEnabled(flag) {
  return process.env[flag] === "true";
}
