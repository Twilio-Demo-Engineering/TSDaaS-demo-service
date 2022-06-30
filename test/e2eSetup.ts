import { exec } from 'child_process';

export default () => exec('prisma migrate reset --force');
