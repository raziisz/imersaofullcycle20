export interface EnvConfig {
  getAppPort(): number;
  getNodeEnv(): string;
  getMapApiKey(): string;
  getKafkaBroker(): string;
  getHostName(): string;
}
