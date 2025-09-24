import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SeederService } from 'src/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeederService);
  await seeder.seedPermissionAndRole();
  await app.close();
}
bootstrap()
  .then(() => {
    console.log('seeder completed.');
  })
  .catch((error) => {
    console.error('Seeder failed:', error);
    process.exit(1);
  });
