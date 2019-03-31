import githubRepositoriesStyle from 'css-loader!./github-repositories.css';

export default class GithubRepositories extends HTMLElement {
  static get observedAttributes() {
    return ['nickname'];
  }

  get nickname() {
    return this.getAttribute('nickname');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async getUserRepositories(id) {
    const response = await fetch(`https://api.github.com/users/${id}/repos`);
    if (!response.ok) return { message: 'Opss, something is wrong!' };
    return response.json();
  }

  async attributeChangedCallback() {
    const userRepositories = await this.getUserRepositories(this.nickname);
    this.shadowRoot.innerHTML = this.render(userRepositories);
  }

  userRepositoryTemplate(repo) {
    const { name, url } = repo;
    return `
      <a href="${url}" target="_blank">${name}</a>
    `;
  }

  userRepositoriesTemplate(repos = []) {
    return `
      <div>
        <h1>Repositories</h1>
        ${repos.reduce((acc, repo) => `${acc}${this.userRepositoryTemplate(repo)}`, '')}
      </div>
    `;
  }

  render(userRepositories) {
    const { message } = userRepositories;
    return `
      <style>
        ${githubRepositoriesStyle.toString()}
      </style>
      ${
        message
          ? `<div>${message}</div>`
          : this.userRepositoriesTemplate(userRepositories)
      }
    `;
  }
}

customElements.define('github-repositories', GithubRepositories);
