import { Divider } from "antd";
import { Book, DollarSign, FileText, Home, User } from "lucide-react";
import React from "react";
import Menu, { IMenu } from "./nav";

const mainMenuData: IMenu[] = [
  {
    id: "home",
    name: "홈",
    icon: <Home className="w-5 h-5" />,
    link: {
      path: "/",
    },
  },
  {
    id: "user",
    name: "사용자",
    icon: <User className="w-5 h-5" />,
    submenu: [
      {
        id: "userList",
        name: "사용자 목록",
        link: {
          path: "/user",
        },
      },
    ],
  },
  {
    id: "project",
    name: "프로젝트",
    icon: <FileText className="w-5 h-5" />,
    submenu: [
      {
        id: "projectList",
        name: "프로젝트 목록",
        link: {
          path: "/project",
        },
      },
    ],
  },
];

const devMenuData: IMenu[] = [
  {
    id: "dev",
    name: "사용 가이드",
    icon: <Book className="w-5 h-5" />,
    submenu: [
      {
        name: "폼",
        link: {
          path: "/sample/form",
        },
      },
    ],
  },
];

const payMenuData: IMenu[] = [
  {
    id: "pay",
    name: "유료 API",
    icon: <DollarSign className="w-5 h-5" />,
    submenu: [
      {
        name: "Chatgpt API",
        link: {
          path: "/chatgpt",
        },
      },
    ],
  },
];

const MainMenu = () => {
  return (
    <>
      <Divider orientation="left" plain>
        메인
      </Divider>
      <Menu data={mainMenuData} />

      {/* <Divider orientation="left" plain>
        개발
      </Divider>
      <Menu data={devMenuData} /> */}

      <Divider orientation="left" plain>
        유료 API
      </Divider>
      <Menu data={payMenuData} />
    </>
  );
};

export default React.memo(MainMenu);
