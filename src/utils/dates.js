export function formatIsoString(s) {
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute:'2-digit'
  };
  return new Date(s).toLocaleString([], options);
};
