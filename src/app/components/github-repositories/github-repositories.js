import http from 'services/http-wrapper';
import getTemplate from 'helpers/get-template';
import githubRepositoriesTemplate from './github-repositories.html';

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
    this.shadowRoot.appendChild(getTemplate(githubRepositoriesTemplate));
    this.listEl = this.shadowRoot.querySelector('span');
  }

  repositoriesTpl(repos = []) {
    return repos.reduce((acc, repo) => `${acc} ${this.repositoryTpl(repo)}`, '');
  }

  repositoryTpl(repo) {
    const { name, url } = repo;
    return `
      <a href="${url}" target="_blank">${name}</a>
    `;
  }

  async attributeChangedCallback() {
    const repositories = await http.getRepositories(this.nickname);
    this.render(repositories);
  }

  render(repositories) {
    this.listEl.innerHTML = this.repositoriesTpl(repositories);
  }
}

customElements.define('github-repositories', GithubRepositories);
