export function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function classToJson(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}

export function randomEnumValue<T>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj);
  const index = Math.floor(Math.random() * enumValues.length);
  return enumValues[index];
}
