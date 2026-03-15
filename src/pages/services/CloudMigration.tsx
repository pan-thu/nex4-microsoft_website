import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function CloudMigration() {
  return <ServicePage data={SERVICES['cloud-migration']} />;
}
