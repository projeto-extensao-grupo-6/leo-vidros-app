class BaseService {
  constructor(api) {
    this.api = api;
  }

  async _handle(promise) {
    try {
      const response = await promise;
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ??
          error.message ??
          "Erro na requisição",
        status: error.response?.status,
      };
    }
  }

  get(url, config) {
    return this._handle(this.api.get(url, config));
  }

  post(url, data, config) {
    return this._handle(this.api.post(url, data, config));
  }

  put(url, data, config) {
    return this._handle(this.api.put(url, data, config));
  }

  delete(url, config) {
    return this._handle(this.api.delete(url, config));
  }
}

export default BaseService;
