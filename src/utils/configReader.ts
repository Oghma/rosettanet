import * as fs from 'fs'
import * as path from 'path'
interface Config {
  appName: string
  port: number
}

export function readConfig(): Config {
  const configPath = path.resolve(__dirname, '../../config.json')

  // Check if the config file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at path: ${configPath}`)
  }

  // Check if the file is a JSON file
  if (path.extname(configPath) !== '.json') {
    throw new Error(`Configuration file is not a JSON file: ${configPath}`)
  }

  // Check if the file has read access
  try {
    fs.accessSync(configPath, fs.constants.R_OK)
  } catch (error) {
    throw new Error(`Configuration file is not readable: ${configPath}`)
  }

  const rawData = fs.readFileSync(configPath, 'utf8')

  // Try to parse the JSON file
  let config: Config
  try {
    config = JSON.parse(rawData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error parsing JSON configuration file: ${error.message}`)
  }

  // Check if the required properties exist and have the correct types
  if (typeof config.appName !== 'string') {
    throw new Error(
      `Invalid or missing 'appName' in configuration file: ${configPath}`,
    )
  }
  if (typeof config.port !== 'number') {
    throw new Error(
      `Invalid or missing 'port' in configuration file: ${configPath}`,
    )
  }

  return config
}

const config: Config = readConfig()

export default config
