/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 21/08/2025 - 16:32:43
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 21/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;

    namespace NodeJS {
        interface ProcessEnv {
            APP_NAME_NODE: Process.Env['APP_NAME'];
        }
    }
}
