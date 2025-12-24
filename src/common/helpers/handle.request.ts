export async function handleRequest(
  callback: () => Promise<any>,
  successMessage = 'Request successful',
) {
  try {
    const data = await callback();
    return {
      statusCode: 200,
      status: 'success',
      message: successMessage,
      data,
    };
  } catch (error: any) {
    const message =
      error?.response?.message || error?.message || 'Something went wrong';
    const statusCode = error?.status || error?.response?.statusCode || 500;

    return {
      statusCode,
      status: 'error',
      message,
      data: null,
    };
  }
}
