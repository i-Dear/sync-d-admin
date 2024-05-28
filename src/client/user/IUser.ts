export interface IUser {
  id: string;
  email: string;
  name: string;
  status: string;
  profileImg: string;
  projectIds: string[];
}

export interface IUserFormValue {
  searchDateType: string;
  searchDatePeriod: [Date, Date];
  status: string[];
  searchType: string;
  searchText: string;
}
