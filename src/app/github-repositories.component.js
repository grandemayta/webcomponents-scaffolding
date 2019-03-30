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

  userRepositoryTemplate(name) {
    return `
      <p>${name}</p>
    `;
  }

  userRepositoriesTemplate(repos = []) {
    return `
      <div>
        ${repos.reduce(
          (acc, repo) => `${acc}${this.userRepositoryTemplate(repo.name)}`,
          ''
        )}
      </div>
    `;
  }

  render(userRepositories) {
    const { message } = userRepositories;
    return `
      <style>
        *, :host {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        :host {
          display: inline-block;
          width: 240px;
          height: 300px;
          border: 2px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        div {
          display: block;
          height: 100%;
          overflow: auto;
        }
        p {
          padding: 20px 20px 0 20px;
        }
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
