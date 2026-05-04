import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function WorkplaceProductivity() {
  return <ServicePage data={SERVICES['workforce-productivity']} />;
}
