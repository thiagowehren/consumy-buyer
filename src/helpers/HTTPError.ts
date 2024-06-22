export class HTTPError extends Error {
    public status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = 'HTTPError';
      this.status = status;
    }
}