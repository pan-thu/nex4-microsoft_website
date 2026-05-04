import { ServicePage } from '@/components/services/ServicePage';
import { SERVICES } from '@/data/services';

export function WorkplaceAI() {
  return <ServicePage data={SERVICES['workforce-ai']} />;
}
