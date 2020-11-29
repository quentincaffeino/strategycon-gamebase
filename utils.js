
import path from 'path';
import dotenv from 'dotenv';


export function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('yarn', ['serve', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}


/**
 * Loads environment specific variables
 * @param {Object} config 
 */
export const setupEnv = (() => {
  const DEVELOPMENT_ENV = 'development'
  const PRODUCTION_ENV = 'production'
  const DEFAULT_ENV = DEVELOPMENT_ENV

  let dotEnv;

  /**
   * @param {string} env 
   */
  function getEnvFilenameSuffix(env) {
    let suffix = '.' + env;

    if (env === DEVELOPMENT_ENV) {
      suffix = ''
    } else if (env === PRODUCTION_ENV) {
      suffix = '.prod'
    }

    return suffix
  }

  return function (config) {
    if (dotEnv) return dotEnv

    // Fallback to dev env
    let env = config.env || DEFAULT_ENV

    // Get 
    const suffix = getEnvFilenameSuffix(env)
    const localEnvConfig = dotenv.config({
      path: path.resolve(process.cwd(), './.env' + suffix + '.local')
    })
    const envConfig = dotenv.config({
      path: path.resolve(process.cwd(), './.env' + suffix)
    })
    dotEnv = Object.assign({}, envConfig.parsed, localEnvConfig.parsed)

    return dotEnv
  }
})()


export const getReplaceObj = (() => {
  const NODE_ENV = process.env.NODE_ENV
  const loadedEnv = setupEnv({ env: NODE_ENV })
  const replaceObj = Object.assign({}, loadedEnv, {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  })

  return () => replaceObj;
})()
