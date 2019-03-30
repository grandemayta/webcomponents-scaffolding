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
        <img src="${avatar}">
        <h1>${name || nickname}</h1>
      </div>
    `;
  }

  render(userProfile) {
    const { login: nickname, name, avatar_url: avatar, message } = userProfile;

    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        div {
          display: inline-block;
          padding: 20px;
          width: 240px;
          height: 300px;
          border: 2px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        img {
          width: 100%;
          border-radius: 50%;
        }
        h1 {
            margin-top: 20px;
            font-size: 18px;
            text-transform: uppercase;
            text-align: center;
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
