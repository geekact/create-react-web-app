{#axios_import#}

export const httpClient = axios.create({
  // baseURL: 'http://example.com',
});

httpClient.interceptors.request.use((cfg) => {
  return cfg;
});

httpClient.interceptors.response.use(undefined, (err: AxiosError) => {
  throw err;
});
