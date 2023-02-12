let lastId: number = 0;
export function generateId() {
  return ++lastId;
}
