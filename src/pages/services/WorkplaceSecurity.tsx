import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function WorkplaceSecurity() {
  return <ServicePage data={SERVICES['workforce-security']} />;
}
