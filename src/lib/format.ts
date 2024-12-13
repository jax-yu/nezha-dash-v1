export function formatBytes(bytes: number, decimals: number = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}


export function formatSpeed(val: number) {
  const units = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];
  let index = 0;

  while (val >= 1024 && index < units.length - 1) {
    val /= 1024;
    index++;
  }

  return `${val.toFixed(2)}${units[index]}`;
}
