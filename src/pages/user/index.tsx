// src/pages/user/index.tsx
import { getDefaultLayout, IDefaultLayoutPage, IPageHeader } from "@/components/layout/default-layout";
import UserList from "@/pages/user/list";
import UserSearch from "./user-search";

const pageHeader: IPageHeader = {
  title: "사용자 목록",
};

const UserListPage: IDefaultLayoutPage = () => {
  return (
    <>
      <UserSearch />
      <UserList />
    </>
  );
};

UserListPage.getLayout = getDefaultLayout;
UserListPage.pageHeader = pageHeader;

export default UserListPage;
