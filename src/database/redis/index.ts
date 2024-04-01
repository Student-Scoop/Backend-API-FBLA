import config from '@/config/env';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

let redisClient = createClient({
	password: config.REDIS_PASSWORD,
	socket: {
		host: config.REDIS_HOST,
		port: Number(config.REDIS_PORT)
	}
});

redisClient.connect().catch(console.error);
redisClient.on('ready', () => console.log('✅ Redis is ready'));
redisClient.on('error', (err) => console.error('🟥 Redis error:', err));

export default new RedisStore({
	client: redisClient,
	prefix: 'student-scoop:'
});
