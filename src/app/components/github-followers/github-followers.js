import http from 'services/http-wrapper';
import getTemplate from 'helpers/get-template';
import githubFollowersTemplate from './github-followers.html';

export default class GithubFollowers extends HTMLElement {
  static get observedAttributes() {
    return ['nickname'];
  }

  get nickname() {
    return this.getAttribute('nickname');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(getTemplate(githubFollowersTemplate));
    this.listEl = this.shadowRoot.querySelector('span');
  }

  followersTpl(followers = []) {
    return followers.reduce(
      (acc, follower) => `${acc} ${this.followerTpl(follower)}`,
      ''
    );
  }

  followerTpl(follower) {
    const { login, html_url: url } = follower;
    return `
      <a href="${url}" target="_blank">${login}</a>
    `;
  }

  async attributeChangedCallback() {
    const followers = await http.getFollowers(this.nickname);
    this.render(followers);
  }

  render(userfollowers) {
    this.listEl.innerHTML = this.followersTpl(userfollowers);
  }
}

customElements.define('github-followers', GithubFollowers);
