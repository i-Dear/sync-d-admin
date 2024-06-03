import UserCreate from "@/components/page/user/UserCreate"; // UserCreate 컴포넌트 import
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Alert, Button, Dropdown, MenuProps, Modal, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 변경
  const [editingUser, setEditingUser] = useState<any>(null); // 수정할 사용자 데이터 상태
  const router = useRouter();
  const { status = "ALL", searchType = "userName", searchText = "" } = router.query;

  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    status: "ALL",
    searchType: "userName",
    searchText: "",
  });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (status && status !== "ALL") {
      params.status = Array.isArray(status) ? status.join(",") : status;
    }
    if (searchType) {
      params.searchType = Array.isArray(searchType) ? searchType[0] : searchType;
    }
    if (searchText) {
      params.searchText = Array.isArray(searchText) ? searchText[0] : searchText;
    }
    setQueryParams(params);
  }, [status, searchType, searchText]);

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://syncd-backend.dev.i-dear.org/admin/user/search?${queryString}`;
  const { data, error, mutate } = useSWR(url, fetcher);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: pageNumber },
      });
    },
    [router]
  );

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const modifyDropdownItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "statusUpdate",
        label: <a onClick={() => console.log(selectedRowKeys)}>상태 수정</a>,
      },
    ],
    [selectedRowKeys]
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleDelete = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch("https://syncd-backend.dev.i-dear.org/admin/user/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          mutate(); // 데이터 갱신
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [mutate]
  );

  const handleEdit = (record: any) => {
    setEditingUser(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDownloadExcel = () => {
    if (!data || !data.users) {
      console.error("No data available for download");
      return;
    }

    const usersForExcel = data.users.map((userWithProjects: any) => ({
      ...userWithProjects.user,
      projects: userWithProjects.user.projectIds.join(", "), // 프로젝트 ID들만 엑셀로 저장
    }));

    const worksheet = XLSX.utils.json_to_sheet(usersForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "syncd_users.xlsx");
  };

  const columns: ColumnsType<any> = [
    {
      key: "action",
      width: 120,
      align: "center",
      render: (_value: unknown, record: any) => (
        <span className="flex justify-center gap-2">
          <a onClick={() => handleEdit(record)} className="px-2 py-1 text-sm btn">
            수정
          </a>
          <Popconfirm
            title="사용자를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.user.id)}
            okText="예"
            cancelText="아니오"
          >
            <a className="px-2 py-1 text-sm btn">삭제</a>
          </Popconfirm>
        </span>
      ),
    },
    {
      title: "사용자명",
      dataIndex: ["user", "name"],
    },
    {
      title: "이메일",
      dataIndex: ["user", "email"],
    },
    {
      title: "상태",
      dataIndex: ["user", "status"],
      align: "center",
      width: 100,
    },
    {
      title: "프로필 이미지",
      dataIndex: ["user", "profileImg"],
      align: "center",
      render: (value: string) => <img src={value} alt="profile" style={{ width: 50, height: 50 }} />,
    },
    {
      title: "프로젝트 ID",
      dataIndex: ["user", "projectIds"],
      render: (projectIds: string[]) => projectIds.join(", "), // 프로젝트 ID들을 콤마로 구분하여 표시
    },
  ];

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" />;
  }

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
          <Dropdown disabled={!hasSelected} menu={{ items: modifyDropdownItems }} trigger={["click"]}>
            <Button>일괄 수정</Button>
          </Dropdown>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `${selectedRowKeys.length}건 선택` : ""}</span>
        </div>
        <div className="flex-item-list">
          <Button className="btn-with-icon" icon={<Download />} onClick={handleDownloadExcel}>
            엑셀 다운로드
          </Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            사용자 등록
          </Button>
        </div>
      </DefaultTableBtn>
      <DefaultTable<any>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.users || []}
        loading={!data}
        pagination={{
          current: Number(router.query.page || 1),
          defaultPageSize: 5,
          total: data?.totalCount || 0,
          showSizeChanger: false,
          onChange: handleChangePage,
        }}
        className="mt-3"
        countLabel={data?.totalCount}
      />
      <Modal
        title={editingUser ? "사용자 수정" : "사용자 등록"}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <UserCreate user={editingUser} onFinish={mutate} onClose={handleModalClose} />
      </Modal>
    </>
  );
};

export default React.memo(UserList);
