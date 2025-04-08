export async function tc(asyncFn) {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
}
