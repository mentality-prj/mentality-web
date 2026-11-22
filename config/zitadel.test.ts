import { zitadelConfig } from './zitadel'

describe('Dzvin / QDIP shared Zitadel identity', () => {
  it('registers new users in QDIP organization without changing standard OIDC scopes', () => {
    expect(zitadelConfig.scopes).toEqual([
      'openid',
      'profile',
      'email',
      'offline_access',
      'urn:zitadel:iam:org:id:400021806318146947',
    ])
  })
})
