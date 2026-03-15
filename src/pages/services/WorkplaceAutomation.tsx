import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function WorkplaceAutomation() {
  return <ServicePage data={SERVICES['workplace-automation']} />;
}
