"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceEventTable } from "./service-event-table";

type Event = {
  id: string;
  title: string;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  eventOrder: string[];
};

type ServiceCardProps = {
  service: Service;
  events: Event[];
  allEvents: Event[];
  onOrderChange: (serviceId: string, newOrder: string[]) => void;
};

export function ServiceCard({
  service,
  events,
  allEvents,
  onOrderChange,
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        {service.description && (
          <p className="text-sm text-muted-foreground">{service.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ServiceEventTable
          serviceId={service.id}
          events={events}
          eventOrder={service.eventOrder}
          allEvents={allEvents}
          onOrderChange={onOrderChange}
        />
      </CardContent>
    </Card>
  );
}

