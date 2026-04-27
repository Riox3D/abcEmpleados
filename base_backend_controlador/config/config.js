import dotenv from 'dotenv'
dotenv.config()

export const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BASE_URL_ADJUNTOS: process.env.BASE_URLADJUNTOS,
  BASE_URL_NOTIFY: process.env.BASE_URLNOTIFY,
  URL_SQL: process.env.BASE_URLSQL,
  CLIENT_ID: process.env.CLIENT_ID,
  cookieSecure: process.env.COOKIE_SECURE === 'true', // Las variables de entorno son strings, hay que convertirlas
  ldapUrl: process.env.LDAP_URL,
  ldapDomain: process.env.LDAP_DOMAIN,
  ldapUserSearchBase: process.env.LDAP_USER_SEARCH_BASE,
  varSamSite: process.env.VAR_SAMSITE
}
