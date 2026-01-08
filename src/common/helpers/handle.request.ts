interface HttpErrorResponse {
  message?: string;
  statusCode?: number;
}

interface HttpError {
  response?: HttpErrorResponse;
  message?: string;
  status?: number;
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
  } catch (error: unknown) {
    let message = 'Something went wrong';
    let statusCode = 500;

    // Type guard for error object
    if (typeof error === 'object' && error !== null) {
      const err = error as HttpError;
      message = err.response?.message ?? err.message ?? message;
      statusCode = err.response?.statusCode ?? err.status ?? statusCode;
    }

    return {
      statusCode,
      status: 'error',
      message,
      data: null,
    };
  }
}
