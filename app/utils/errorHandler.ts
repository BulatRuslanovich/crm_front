/**
 * Утилита для обработки ошибок API
 */

export interface ApiError {
  message?: string;
  title?: string;
  details?: string;
  error?: string;
  errors?: Record<string, string[]>;
  status?: number;
  type?: string;
  traceId?: string;
}

/**
 * Обрабатывает ответ от API и извлекает сообщение об ошибке
 * @param response - Ответ от fetch API
 * @param defaultMessage - Сообщение по умолчанию, если не удалось извлечь ошибку
 * @returns Promise с сообщением об ошибке
 */
export async function handleApiError(response: Response, defaultMessage: string): Promise<string> {
  try {
    const errorData: ApiError = await response.json();
    
    // Обработка валидационных ошибок (400 Bad Request)
    if (errorData.errors && typeof errorData.errors === 'object') {
      const errorMessages: string[] = [];
      for (const [, messages] of Object.entries(errorData.errors)) {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        }
      }
      return errorMessages.join('; ') || errorData.title || defaultMessage;
    }
    
    // Обработка обычных ошибок
    return errorData.title || errorData.message || errorData.error || defaultMessage;
  } catch {
    // Если не удалось распарсить JSON, используем статус ответа
    return `Ошибка сервера: ${response.status} ${response.statusText}`;
  }
}

/**
 * Проверяет успешность ответа и выбрасывает ошибку с детальным сообщением
 * @param response - Ответ от fetch API
 * @param defaultMessage - Сообщение по умолчанию
 * @throws Error с сообщением об ошибке
 */
export async function checkResponse(response: Response, defaultMessage: string): Promise<void> {
  if (!response.ok) {
    const errorMessage = await handleApiError(response, defaultMessage);
    throw new Error(errorMessage);
  }
}
