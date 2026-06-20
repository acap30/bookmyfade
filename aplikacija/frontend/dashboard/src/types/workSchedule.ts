export interface IWorkSchedule {
  monday: {
    from: string;
    to: string;
    off: boolean;
  };
  tuesday: {
    from: string;
    to: string;
    off: boolean;
  };
  wednesday: {
    from: string;
    to: string;
    off: boolean;
  };
  thursday: {
    from: string;
    to: string;
    off: boolean;
  };
  friday: {
    from: string;
    to: string;
    off: boolean;
  };
  saturday: {
    from: string;
    to: string;
    off: boolean;
  };
  sunday: {
    from: string;
    to: string;
    off: boolean;
  };
}

export interface IDayOff {
  start_date: string;
  end_date: string;
  detail: string;
}

export interface IScheduleOverride {
  id: number;
  date: string;
  from: string;
  to: string;
  off: boolean;
  detail?: string;
}
