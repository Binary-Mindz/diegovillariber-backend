export async function handleRequest<T>(
  callback: () => Promise<T>,
  message = 'Request successful',
  successStatusCode = 200, // success এ default
) {
  try {
    const data = await callback();

    return {
      statusCode: successStatusCode,
      status: 'success',
      message,
      data,
    };
  } catch (err: any) {
    return {
      statusCode:
        err?.response?.statusCode ||
        err?.status ||
        500,
      status: 'error',
      message:
        Array.isArray(err?.response?.message)
          ? err.response.message.join(', ')
          : err?.response?.message ||
            err?.message ||
            'Something went wrong',
      data: null,
    };
  }
}
