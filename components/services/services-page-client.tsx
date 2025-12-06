"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "./service-card";

type Event = {
  id: string;
  title: string;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  eventOrder: string[];
  createdAt: Date;
  updatedAt: Date;
};

type ServicesPageClientProps = {
  initialServices: Service[];
  initialEvents: Event[];
};

export function ServicesPageClient({
  initialServices,
  initialEvents,
}: ServicesPageClientProps) {
  const router = useRouter();
  const [services, setServices] = React.useState(initialServices);

  const handleOrderChange = React.useCallback(
    async (serviceId: string, newOrder: string[]) => {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventOrder: newOrder }),
        });

        if (!response.ok) {
          throw new Error("Failed to update service");
        }

        // Update local state
        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, eventOrder: newOrder } : s))
        );

        router.refresh();
      } catch (error) {
        console.error("Error updating service:", error);
      }
    },
    [router]
  );

  // Map eventOrder to actual event objects for each service
  const servicesWithEvents = React.useMemo(() => {
    return services.map((service) => ({
      ...service,
      events: service.eventOrder
        .map((id) => initialEvents.find((e) => e.id === id))
        .filter((e): e is Event => e !== undefined),
    }));
  }, [services, initialEvents]);

  if (services.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Chưa có dịch vụ nào. Hãy tạo dịch vụ mới trong database.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {servicesWithEvents.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          events={service.events}
          allEvents={initialEvents}
          onOrderChange={handleOrderChange}
        />
      ))}
    </div>
  );
}

