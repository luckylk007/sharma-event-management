/**
 * Hostinger Express preset entrypoint.
 * Delegates to the compiled backend (which also serves the frontend in production).
 */
console.log('[boot] starting Sharma Events...');
console.log('[boot] NODE_ENV=', process.env.NODE_ENV || 'undefined');
console.log('[boot] PORT=', process.env.PORT || 'undefined');
console.log('[boot] DATABASE_URL set=', Boolean(process.env.DATABASE_URL));
console.log('[boot] DB_USER set=', Boolean(process.env.DB_USER || process.env.MYSQL_USER));

import './backend/dist/index.js';
