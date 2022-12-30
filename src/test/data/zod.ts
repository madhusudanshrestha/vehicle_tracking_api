export const zodSchemaError = {
  code: 500,
  message: expect.arrayContaining([
    {
      code: expect.any(String),
      expected: expect.any(String),
      message: expect.any(String),
      path: expect.arrayContaining<string>([]),
      received: expect.any(String)
    }
  ])
}
