// types.ts
interface Event {
  id: string;
  title: string;
  start: string; // You may want to use a Date type here
  end: string; // You may want to use a Date type here
  timezone: string;
  location: any;
  description: string;
  category: string;
  country: string;
  scope: string;
  state: string;
  private: string;
  name: string;
  entity_id: string;
  entities: [];
  labels: [];
}

export default Event;
