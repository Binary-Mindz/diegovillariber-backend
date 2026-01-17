interface ErrorResponse {
  message?: string;
  statusCode?: number;
}

export async function handleRequest<T>(
  callback: () => Promise<T>,
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
  } catch (err: unknown) {
    let message = 'Something went wrong';
    let statusCode = 500;

    if (typeof err === 'object' && err !== null) {
      const e = err as {
        response?: unknown;
        message?: string;
        status?: number;
      };

      if (e.response && typeof e.response === 'object') {
        const r = e.response as ErrorResponse;
        message = r.message ?? message;
        statusCode = r.statusCode ?? statusCode;
      } else {
        message = e.message ?? message;
        statusCode = e.status ?? statusCode;
      }
    }

    return {
      statusCode,
      status: 'error',
      message,
      data: null,
    };
  }
}