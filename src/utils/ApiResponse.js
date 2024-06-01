class ApiResponse {
  constructor(status, payload, responseMessage = "Success") {
    this.status = status;
    this.payload = payload;
    this.message = responseMessage;
    this.success = status < 400;
  }
}
