export default class GithubProfile extends HTMLElement {
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

  async getUserProfile(id) {
    const response = await fetch(`https://api.github.com/users/${id}`);
    if (!response.ok) return { message: 'User not found!' };
    return response.json();
  }

  async attributeChangedCallback() {
    const userProfile = await this.getUserProfile(this.nickname);
    this.shadowRoot.innerHTML = this.render(userProfile);
  }

  userProfileTemplate(name, nickname, avatar) {
    return `
      <div>
        <h1>${name || nickname}<h1>
        <img src="${avatar}">
      </div>
    `;
  }

  render(userProfile) {
    const { login: nickname, name, avatar_url: avatar, message } = userProfile;

    return `
      <style>
        :host {
            display: block;
        }
        h1 {
            text-transform: uppercase;
        }
      </style>
      ${
        message
          ? `<div>${message}</div>`
          : this.userProfileTemplate(name, nickname, avatar)
      }
    `;
  }
}

customElements.define('github-profile', GithubProfile);
