import http from 'services/http-wrapper';
import getTemplate from 'helpers/get-template';
import githubProfileTemplate from './github-profile.html';

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
    this.shadowRoot.appendChild(getTemplate(githubProfileTemplate));
    this.nameEl = this.shadowRoot.querySelector('h1');
    this.imageEl = this.shadowRoot.querySelector('img');
  }

  async attributeChangedCallback() {
    const profile = await http.getProfile(this.nickname);
    this.render(profile);
  }

  render(profile) {
    const { login, name, avatar_url: avatar } = profile;

    this.nameEl.innerText = name || login;
    this.imageEl.setAttribute('src', avatar);
  }
}

customElements.define('github-profile', GithubProfile);
