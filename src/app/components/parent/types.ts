export interface Feature {
  id: string;
  title: string;
  description: string;
  detail: string;
  icon: string;
  color: string;
  tag?: string;
}

export interface Phase {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  dotColor: string;
  features: Feature[];
}
