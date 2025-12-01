export function formatDate(input: string, format: string = 'dd MMM yyyy') {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return 'No date';
  }

  const map: Record<string, string> = {
    dd: date.getDate().toString().padStart(2, '0'),
    d: date.getDate().toString(),

    MMM: date.toLocaleDateString('en-US', { month: 'short' }),
    MM: (date.getMonth() + 1).toString().padStart(2, '0'),
    M: (date.getMonth() + 1).toString(),

    yyyy: date.getFullYear().toString(),
    yy: date.getFullYear.toString().slice(-2),
  }

  let result = format;
  Object.keys(map).forEach(token => {
    result = result.replace(token, map[token]);
  });

  return result;

}
