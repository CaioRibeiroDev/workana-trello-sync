declare namespace NodeJS {
  interface ProcessEnv {
    WORKANA_EMAIL: string;
    WORKANA_PASSWORD: string;
    TRELLO_KEY: string;
    TRELLO_TOKEN: string;
    LIST_ID: string
  }
}