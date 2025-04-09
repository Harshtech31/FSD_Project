import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateTripForm from '@/components/trips/CreateTripForm';

export default function CreateTripPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CreateTripForm />
        </div>
      </div>
    </DashboardLayout>
  );
} 