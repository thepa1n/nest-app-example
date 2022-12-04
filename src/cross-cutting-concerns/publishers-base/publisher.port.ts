export interface PublisherPort<Event> {
  publishEvent(event: Event): Promise<boolean>;

  publishMultipleEvent(events: Event[]): Promise<void>;
}
