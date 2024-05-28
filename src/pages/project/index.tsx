import { getDefaultLayout, IDefaultLayoutPage, IPageHeader } from "@/components/layout/default-layout";
import ProjectList from "@/pages/project/list";

const pageHeader: IPageHeader = {
  title: "프로젝트 목록",
};

const ProjectListPage: IDefaultLayoutPage = () => {
  return <ProjectList />;
};

ProjectListPage.getLayout = getDefaultLayout;
ProjectListPage.pageHeader = pageHeader;

export default ProjectListPage;
