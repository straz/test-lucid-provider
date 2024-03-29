import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

const DEFAULT_SCOPES = [
  "lucidchart.document.content",
  "offline_access",
  "user.profile",
];

// Random find on lucid's website. We can probably do better.
const LUCID_LOGO =
  "https://help.lucid.co/hc/article_attachments/15482982403348";

export interface LucidProfile extends Record<string, any> {
  name: string;
  email: string;
  picture: string;
}

export default function LucidChartProvider<P extends LucidProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const apiHost = "https://api.lucid.co";
  const { issuer = "https://lucid.app" } = options;
  return {
    id: "lucidchart",
    name: "LucidChart",
    type: "oauth",
    checks: ["pkce", "state"],
    allowDangerousEmailAccountLinking: true,
    authorization: `${issuer}/oauth2/authorize?scope=${DEFAULT_SCOPES.join(" ")}`,
    token: `${apiHost}/oauth2/token`,
    userinfo: `${apiHost}/oauth2/users/me/profile`,
    style: { logo: LUCID_LOGO, bg: "#fff", text: "#000" },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    options,
  };
}
