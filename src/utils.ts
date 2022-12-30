export const getErrorResponse = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}
