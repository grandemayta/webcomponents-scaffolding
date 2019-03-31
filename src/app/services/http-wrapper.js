const httpWrapper = {
  BASE_URL: 'https://api.github.com',
  service: {},

  async getConfig(endpoint) {
    const response = await fetch(`${this.BASE_URL}/${endpoint}`);
    if (!response.ok) return { message: 'Opss, something is wrong!' };
    return response.json();
  },

  getProfile(id) {
    return this.getConfig(`users/${id}`);
  },

  getRepositories(id) {
    return this.getConfig(`users/${id}/repos`);
  },

  getFollowers(id) {
    return this.getConfig(`users/${id}/followers`);
  }
};

export default httpWrapper;
