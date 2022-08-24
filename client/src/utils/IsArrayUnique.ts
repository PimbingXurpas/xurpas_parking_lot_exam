export function IsArrayUnique(myArray: Array<number | string>) {
  return myArray.length === new Set(myArray).size;
}
