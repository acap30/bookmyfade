export interface IWorkSchedule {
  monday: {
    from: string;
    to: string;
  };
  tuesday: {
    from: string;
    to: string;
  };
  wednesday: {
    from: string;
    to: string;
  };
  thursday: {
    from: string;
    to: string;
  };
  friday: {
    from: string;
    to: string;
  };
  saturday: {
    from: string;
    to: string;
  };
  sunday: {
    from: string;
    to: string;
  };
}

export interface IDayOff {
  id: number;
  from: string;
  to: string;
  reason: string;
}
