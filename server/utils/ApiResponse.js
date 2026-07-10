/**
 * Standardized API Response class for consistent JSON responses.
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, 'Success'));
 *
 * @class ApiResponse
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response payload
   * @param {string} message - Response message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
