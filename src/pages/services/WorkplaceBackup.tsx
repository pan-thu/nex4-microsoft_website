import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function WorkplaceBackup() {
  return <ServicePage data={SERVICES['workforce-backup-recovery']} />;
}
